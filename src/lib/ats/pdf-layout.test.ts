import { describe, expect, it } from "vitest";
import { orderPdfText, type PdfTextFragment } from "./pdf-layout";

const fragment = (text: string, x: number, y: number, width = 60): PdfTextFragment =>
  ({ text, x, y, width, height: 10 });

describe("PDF visual reading order", () => {
  it("keeps certificate badges and a late-painted header out of the certificate words", () => {
    expect(orderPdfText([
      fragment("Escola DNC", 40, 120),
      fragment("Trilha AI Fluency", 40, 145),
      fragment("CERTIFICADOS", 40, 95),
    ])).toBe("CERTIFICADOS\nEscola DNC\nTrilha AI Fluency");
  });
  it("rejoins contiguous word fragments but spaces separated labels", () => {
    expect(orderPdfText([
      fragment("DNC", 77, 120, 20),
      fragment("Escola", 40, 120, 32),
      fragment("Fluency", 151, 145, 40),
      fragment("Trilha AI ", 40, 145, 50),
      fragment("CERTIFI", 40, 95, 42),
      fragment("CADOS", 82, 95, 35),
    ])).toBe("CERTIFICADOS\nEscola DNC\nTrilha AI Fluency");
  });
});