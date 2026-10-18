/** Browser-safe visual ordering, independent of PDF painting/source order. */
export interface PdfTextFragment {
  text: string;
  x: number;
  y: number; // viewport coordinates: top to bottom
  width: number;
  height: number;
}

export function orderPdfText(fragments: PdfTextFragment[]): string {
  const lines: { y: number; height: number; items: PdfTextFragment[] }[] = [];
  const sorted = fragments.filter((f) => f.text.trim() && Number.isFinite(f.x) && Number.isFinite(f.y))
    .sort((a, b) => a.y - b.y || a.x - b.x);
  for (const fragment of sorted) {
    const last = lines.at(-1);
    const tolerance = Math.max(1, Math.min(3, Math.min(last?.height ?? fragment.height, fragment.height) * 0.3));
    if (last && Math.abs(last.y - fragment.y) <= tolerance) {
      last.items.push(fragment);
    } else {
      lines.push({ y: fragment.y, height: fragment.height, items: [fragment] });
    }
  }
  return lines.map((line) => {
    const items = line.items.sort((a, b) => a.x - b.x);
    let text = "";
    let previous: PdfTextFragment | undefined;
    for (const item of items) {
      const gap = previous ? item.x - (previous.x + previous.width) : 0;
      const needsSpace = previous && gap > Math.max(0.8, item.height * 0.08)
        && !/\s$/.test(text) && !/^\s/.test(item.text);
      text += (needsSpace ? " " : "") + item.text;
      previous = item;
    }
    return text.replace(/[ \t]+/g, " ").trim();
  }).join("\n").trim();
}