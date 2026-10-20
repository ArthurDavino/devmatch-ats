// Extracts text from a PDF entirely in the browser (file never leaves the device).
import { orderPdfText, type PdfTextFragment } from "./pdf-layout";
import { repairPdfBytes } from "./pdf-repair";
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";

const READ_TIMEOUT_MS = 12000;

export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const { bytes, fixed } = await repairPdfBytes(new Uint8Array(await file.arrayBuffer()));
  if (fixed) console.info(`[pdf-import] repaired ${fixed} corrupted byte(s) before reading`);
  // Vite owns the only worker entry; PDF.js never resolves another worker URL.
  const port = new PdfWorker();
  const worker: InstanceType<typeof pdfjs.PDFWorker> = pdfjs.PDFWorker.fromPort({ port });
  const task = pdfjs.getDocument({ data: bytes, worker });
  let timer: ReturnType<typeof setTimeout> | undefined;
  let rejectWorker: ((reason: Error) => void) | undefined;
  const failure = new Promise<never>((_, reject) => {
    rejectWorker = reject;
    timer = setTimeout(() => reject(new Error("A leitura do PDF excedeu 12 segundos. Tente novamente ou cole o texto.")), READ_TIMEOUT_MS);
  });
  const onWorkerError = () => rejectWorker?.(new Error("Não foi possível iniciar o leitor de PDF. Tente novamente ou cole o texto."));
  port.addEventListener("error", onWorkerError);
  port.addEventListener("messageerror", onWorkerError);
  try {
    return await Promise.race([read(), failure]);
  } finally {
    clearTimeout(timer);
    port.removeEventListener("error", onWorkerError);
    port.removeEventListener("messageerror", onWorkerError);
    // Never let a broken worker handshake hold the loading button indefinitely.
    void task.destroy().catch(() => {});
    worker.destroy();
    port.terminate();
  }

  async function read(): Promise<string> {
    const doc = await task.promise;
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const fragments: PdfTextFragment[] = [];
      for (const item of content.items) {
        if (!("str" in item)) continue;
        const [x, y] = viewport.convertToViewportPoint(item.transform[4] ?? 0, item.transform[5] ?? 0);
        if (x === undefined || y === undefined) continue;
        fragments.push({ text: item.str, x, y, width: item.width, height: item.height });
      }
      pages.push(orderPdfText(fragments));
      page.cleanup();
    }
    return pages.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  }
}
