import { describe, expect, it } from "vitest";
import { deflateSync, inflateSync } from "node:zlib";
import { decodeAscii85, repairPdfBytes } from "./pdf-repair";

function encodeAscii85(data: Uint8Array): string {
  let out = "";
  for (let i = 0; i < data.length; i += 4) {
    const chunk = [...data.subarray(i, i + 4)];
    const n = chunk.length;
    while (chunk.length < 4) chunk.push(0);
    let v = (((chunk[0] ?? 0) << 24) | ((chunk[1] ?? 0) << 16) | ((chunk[2] ?? 0) << 8) | (chunk[3] ?? 0)) >>> 0;
    const digits: string[] = [];
    for (let k = 0; k < 5; k++) {
      digits.unshift(String.fromCharCode((v % 85) + 33));
      v = Math.floor(v / 85);
    }
    out += digits.slice(0, n + 1).join("");
  }
  return out + "~>";
}

const content = "BT (CERTIFICADOS) Tj ET BT (Escola DNC) Tj ET BT (Anthropic Academy, Trilha AI Fluency) Tj ET ".repeat(4);

function buildPdf(corruptAt?: number) {
  const encoded = encodeAscii85(new Uint8Array(deflateSync(Buffer.from(content))));
  const chars = encoded.split("");
  if (corruptAt !== undefined) chars[corruptAt] = String.fromCharCode(127);
  const pdf = `%PDF-1.4\n9 0 obj\n<<\n/Filter [ /ASCII85Decode /FlateDecode ] /Length ${chars.length}\n>>\nstream\n${chars.join("")}\nendstream\nendobj\n`;
  return { pdf: new Uint8Array(Buffer.from(pdf, "latin1")), original: encoded };
}

describe("PDF stream repair", () => {
  it("restores a single corrupted byte so the certificates text decodes cleanly", async () => {
    const { pdf } = buildPdf(40);
    const { bytes, fixed } = await repairPdfBytes(pdf);
    expect(fixed).toBe(1);
    expect(bytes.length).toBe(pdf.length);
    const text = Buffer.from(bytes).toString("latin1");
    const body = text.slice(text.indexOf("stream\n") + 7, text.indexOf("~>") + 2);
    const inflated = inflateSync(Buffer.from(decodeAscii85(Buffer.from(body, "latin1"))));
    expect(inflated.toString()).toBe(content);
  });

  it("leaves intact PDFs untouched", async () => {
    const { pdf } = buildPdf();
    const result = await repairPdfBytes(pdf);
    expect(result.fixed).toBe(0);
    expect(result.bytes).toBe(pdf);
  });
});
