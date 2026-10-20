import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  port: { addEventListener: vi.fn(), removeEventListener: vi.fn(), terminate: vi.fn() },
  workerDestroy: vi.fn(),
  taskDestroy: vi.fn().mockResolvedValue(undefined),
  getDocument: vi.fn(),
  pdfWorker: vi.fn(),
}));

vi.mock("pdfjs-dist/build/pdf.worker.min.mjs?worker", () => ({
  default: class { constructor() { return mocks.port; } },
}));
vi.mock("pdfjs-dist", () => ({
  PDFWorker: class {
    static fromPort(options: unknown) { mocks.pdfWorker(options); return new this(); }
    destroy = mocks.workerDestroy;
  },
  getDocument: mocks.getDocument,
}));
vi.mock("./pdf-repair", () => ({ repairPdfBytes: async (bytes: Uint8Array) => ({ bytes, fixed: 0 }) }));

import { extractPdfText } from "./pdf-import";

function file(): File {
  const result = new File(["PDF"], "cv.pdf");
  result.arrayBuffer = async () => new TextEncoder().encode("PDF").buffer;
  return result;
}

afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });

describe("PDF worker lifecycle", () => {
  it("passes the explicit worker port and cleans up after extraction", async () => {
    mocks.getDocument.mockReturnValue({
      promise: Promise.resolve({ numPages: 1, getPage: async () => ({
        getViewport: () => ({ convertToViewportPoint: (x: number, y: number) => [x, y] }),
        getTextContent: async () => ({ items: [{ str: "Escola DNC", transform: [1, 0, 0, 1, 10, 10], width: 80, height: 12 }] }),
        cleanup: vi.fn(),
      }) }), destroy: mocks.taskDestroy,
    });
    expect(await extractPdfText(file())).toBe("Escola DNC");
    expect(mocks.pdfWorker).toHaveBeenCalledWith({ port: mocks.port });
    expect(mocks.getDocument.mock.calls[0]?.[0].worker).toBeDefined();
    expect(mocks.port.terminate).toHaveBeenCalledOnce();
    expect(mocks.taskDestroy).toHaveBeenCalledOnce();
  });

  it("rejects a stalled handshake after 12 seconds and terminates the worker", async () => {
    vi.useFakeTimers();
    mocks.getDocument.mockReturnValue({ promise: new Promise(() => {}), destroy: mocks.taskDestroy });
    const result = extractPdfText(file());
    const assertion = expect(result).rejects.toThrow("12 segundos");
    await vi.advanceTimersByTimeAsync(12000);
    await assertion;
    expect(mocks.port.terminate).toHaveBeenCalledOnce();
  });
});