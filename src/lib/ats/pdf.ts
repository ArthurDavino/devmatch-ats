export async function exportResumePdf(text: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 56;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageH = doc.internal.pageSize.getHeight();
  let y = margin;

  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const isHeading = line.length > 0 && line.length < 60 && line === line.toUpperCase() && /[A-ZÀ-Ú]/.test(line);
    doc.setFont("helvetica", isHeading ? "bold" : "normal");
    doc.setFontSize(isHeading ? 12 : 10.5);
    if (!line) {
      y += 8;
      continue;
    }
    if (isHeading) y += 6;
    const wrapped = doc.splitTextToSize(line, width) as string[];
    for (const w of wrapped) {
      if (y > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(w, margin, y);
      y += isHeading ? 17 : 15;
    }
  }
  doc.save("curriculo-ajustado-ats.pdf");
}
