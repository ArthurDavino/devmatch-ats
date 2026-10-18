// Extracts text from a PDF entirely in the browser (file never leaves the device).
import { orderPdfText, type PdfTextFragment } from "./pdf-layout";
import { repairPdfBytes } from "./pdf-repair";

export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const { bytes, fixed } = await repairPdfBytes(new Uint8Array(await file.arrayBuffer()));
  if (fixed) console.info(`[pdf-import] repaired ${fixed} corrupted byte(s) before reading`);
  const doc = await pdfjs.getDocument({ data: bytes }).promise;
  try {
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const fragments: PdfTextFragment[] = [];
      for (const item of content.items) {
        if (!("str" in item)) continue;
        const [x, y] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
        fragments.push({ text: item.str, x, y, width: item.width, height: item.height });
      }
      pages.push(orderPdfText(fragments));
      page.cleanup();
    }
    return pages.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  } finally {
    await doc.destroy();
  }
}
