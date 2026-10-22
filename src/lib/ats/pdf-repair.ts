/**
 * Browser-safe repair for PDFs whose ASCII85 + Flate page streams contain a few
 * corrupted bytes (e.g. one character flipped during copy/upload). Without this,
 * every PDF reader decodes garbage from that point on and the text gets mixed up.
 *
 * Each invalid byte is swapped for the single ASCII85 character that makes the
 * compressed stream decode with a valid checksum. Replacement keeps the byte
 * length identical, so the PDF's internal offsets stay valid. If no unique fix
 * exists, the stream is left untouched.
 */

const MAX_BAD_BYTES = 2;

function isA85Char(c: number) {
  return (c >= 33 && c <= 117) || c === 122; // "!".."u" and "z"
}
function isWhitespace(c: number) {
  return c === 32 || c === 10 || c === 13 || c === 9 || c === 12 || c === 0;
}

export function decodeAscii85(input: Uint8Array): Uint8Array {
  const out: number[] = [];
  const group: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === undefined) continue;
    if (isWhitespace(c)) continue;
    if (c === 126) break; // "~>" terminator
    if (c === 122) {
      if (group.length) throw new Error("invalid z");
      out.push(0, 0, 0, 0);
      continue;
    }
    if (c < 33 || c > 117) throw new Error("invalid ascii85 char");
    group.push(c - 33);
    if (group.length === 5) {
      let v = 0;
      for (const d of group) v = v * 85 + d;
      if (v > 0xffffffff) throw new Error("ascii85 overflow");
      out.push((v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255);
      group.length = 0;
    }
  }
  if (group.length === 1) throw new Error("invalid ascii85 tail");
  if (group.length) {
    const n = group.length;
    while (group.length < 5) group.push(84);
    let v = 0;
    for (const d of group) v = v * 85 + d;
    if (v > 0xffffffff) throw new Error("ascii85 overflow");
    const bytes = [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
    out.push(...bytes.slice(0, n - 1));
  }
  return new Uint8Array(out);
}

export function adler32(data: Uint8Array): number {
  let a = 1;
  let b = 0;
  for (let i = 0; i < data.length; i++) {
    a = (a + (data[i] ?? 0)) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

async function inflateOk(data: Uint8Array): Promise<boolean> {
  // Verify the zlib checksum ourselves: some browsers' DecompressionStream
  // accept damaged data silently, which would let a wrong byte "pass".
  const n = data.length;
  if (n < 6) return false;
  const expected = (((data[n - 4] ?? 0) << 24) | ((data[n - 3] ?? 0) << 16) | ((data[n - 2] ?? 0) << 8) | (data[n - 1] ?? 0)) >>> 0;
  try {
    const body = new Response(data.slice().buffer).body;
    if (!body) return false;
    const stream = body.pipeThrough(new DecompressionStream("deflate"));
    const out = new Uint8Array(await new Response(stream).arrayBuffer());
    return adler32(out) === expected;
  } catch {
    return false;
  }
}

async function streamIsValid(body: Uint8Array, flate: boolean): Promise<boolean> {
  let decoded: Uint8Array;
  try {
    decoded = decodeAscii85(body);
  } catch {
    return false;
  }
  return flate ? inflateOk(decoded) : false;
}

/** Returns repaired bytes (same length) and how many bytes were fixed. */
export async function repairPdfBytes(input: Uint8Array): Promise<{ bytes: Uint8Array; fixed: number }> {
  let latin1 = "";
  for (let i = 0; i < input.length; i += 8192) {
    latin1 += String.fromCharCode(...input.subarray(i, i + 8192));
  }
  const re = /<<((?:(?!>>\s*stream)[\s\S])*?\/ASCII85Decode[\s\S]*?)>>\s*stream\r?\n/g;
  let bytes = input;
  let fixed = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(latin1))) {
    const start = match.index + match[0].length;
    const end = latin1.indexOf("~>", start);
    if (end < 0) continue;
    const flate = /\/FlateDecode/.test(match[1] ?? "");
    const bad: number[] = [];
    for (let i = start; i < end; i++) {
      const c = bytes[i];
      if (c === undefined) continue;
      if (!isA85Char(c) && !isWhitespace(c)) bad.push(i);
    }
    if (!bad.length || bad.length > MAX_BAD_BYTES || !flate) continue;

    const body = bytes.slice(start, end);
    const positions = bad.map((i) => i - start);
    const solutions: number[][] = [];
    const tryCombo = async (idx: number, chosen: number[]): Promise<void> => {
      if (solutions.length > 1) return;
      if (idx === positions.length) {
        if (await streamIsValid(body, flate)) solutions.push([...chosen]);
        return;
      }
      for (let c = 33; c <= 117; c++) {
        const position = positions[idx];
        if (position === undefined) return;
        body[position] = c;
        await tryCombo(idx + 1, [...chosen, c]);
        if (solutions.length > 1) return;
      }
    };
    await tryCombo(0, []);
    if (solutions.length !== 1) continue; // ambiguous or unrecoverable: leave as-is

    if (bytes === input) bytes = input.slice();
    solutions[0]?.forEach((c, k) => {
      const position = bad[k];
      if (position !== undefined) bytes[position] = c;
    });
    fixed += bad.length;
  }
  return { bytes, fixed };
}
