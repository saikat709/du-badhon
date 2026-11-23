import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface PdfReportPayload {
  title: string;
  subtitle?: string;
  scope?: string;
  month?: string;
  extraMeta?: string[];
  headers: string[];
  rows: (string | number)[][];
  generatedAt?: string;
}

export async function generateDonationReportPdf(payload: PdfReportPayload): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // A4 Landscape orientation: 841.89 x 595.28 pt
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const sideMargin = 36;
  const topMargin = 50;
  const bottomMargin = 36;
  const contentWidth = pageWidth - sideMargin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - topMargin;

  const primaryColor = rgb(0.88, 0.11, 0.28); // Rose 600
  const headerBgColor = rgb(0.96, 0.96, 0.98);
  const altRowColor = rgb(0.98, 0.98, 0.99);
  const textColor = rgb(0.12, 0.16, 0.22);
  const mutedColor = rgb(0.45, 0.50, 0.58);
  const borderColor = rgb(0.85, 0.88, 0.92);

  // Helper to draw header
  const drawPageHeader = (pageNum: number) => {
    // Header Accent Bar: spans height from y to y - 38
    const barHeight = 40;
    page.drawRectangle({
      x: sideMargin,
      y: y - barHeight,
      width: 4,
      height: barHeight,
      color: primaryColor,
    });

    // Brand Title: top line
    page.drawText("BADHON — University of Dhaka", {
      x: sideMargin + 12,
      y: y - 12,
      size: 15,
      font: fontBold,
      color: primaryColor,
    });

    // Report Title: middle line
    page.drawText(payload.title, {
      x: sideMargin + 12,
      y: y - 26,
      size: 11,
      font: fontBold,
      color: textColor,
    });

    // Subtitle & Metadata: bottom line
    const metaParts = [
      payload.subtitle,
      payload.scope ? `Scope: ${payload.scope}` : null,
      payload.month ? `Month: ${payload.month}` : null,
      payload.generatedAt ? `Generated: ${payload.generatedAt}` : `Generated: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    ].filter(Boolean) as string[];

    page.drawText(metaParts.join("   |   "), {
      x: sideMargin + 12,
      y: y - 38,
      size: 8,
      font: fontRegular,
      color: mutedColor,
    });

    y -= barHeight + 16;
  };

  drawPageHeader(1);

  // Table column widths calculation
  const colCount = payload.headers.length;
  // Compute column widths proportionally
  const colWidths: number[] = new Array(colCount).fill(contentWidth / colCount);

  if (colCount === 9) {
    // Member performance report
    // Index, Volunteer Name, Hall Unit, Student ID, Role, Completed Bags, Cancelled, Total Handled, Success Rate
    const weights = [0.4, 1.8, 1.8, 1.0, 1.0, 0.9, 0.8, 0.9, 0.9];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < colCount; i++) {
      colWidths[i] = (weights[i] / totalWeight) * contentWidth;
    }
  } else if (colCount === 12) {
    // Club donations ledger
    // Index, Date, Patient Name, Blood Group, Hospital, Case/Ward, Donation Type, Managed Bags, Needed Bags, Volunteer, Unit, Status
    const weights = [0.4, 0.9, 1.3, 0.7, 1.3, 1.0, 0.9, 0.7, 0.7, 1.2, 1.1, 0.8];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < colCount; i++) {
      colWidths[i] = (weights[i] / totalWeight) * contentWidth;
    }
  }

  const rowHeight = 20;
  const headerHeight = 22;

  const drawTableHeader = () => {
    page.drawRectangle({
      x: sideMargin,
      y: y - headerHeight,
      width: contentWidth,
      height: headerHeight,
      color: headerBgColor,
      borderColor: borderColor,
      borderWidth: 0.5,
    });

    let currentX = sideMargin;
    payload.headers.forEach((headerText, i) => {
      const colW = colWidths[i];
      // Clean text to avoid non-ASCII crash in standard font
      const safeText = String(headerText).replace(/[^\x20-\x7E]/g, " ");
      page.drawText(safeText, {
        x: currentX + 6,
        y: y - 14,
        size: 8,
        font: fontBold,
        color: textColor,
      });
      currentX += colW;
    });

    y -= headerHeight;
  };

  drawTableHeader();

  // Draw Data Rows
  payload.rows.forEach((row, rowIdx) => {
    // Check if new page needed
    if (y - rowHeight < bottomMargin + 20) {
      // Add page
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - topMargin;
      drawPageHeader(pdfDoc.getPageCount());
      drawTableHeader();
    }

    // Row background (alternating)
    if (rowIdx % 2 === 1) {
      page.drawRectangle({
        x: sideMargin,
        y: y - rowHeight,
        width: contentWidth,
        height: rowHeight,
        color: altRowColor,
      });
    }

    // Row bottom border
    page.drawLine({
      start: { x: sideMargin, y: y - rowHeight },
      end: { x: sideMargin + contentWidth, y: y - rowHeight },
      thickness: 0.5,
      color: borderColor,
    });

    let currentX = sideMargin;
    row.forEach((cellVal, colIdx) => {
      const colW = colWidths[colIdx];
      let str = String(cellVal ?? "").replace(/[^\x20-\x7E]/g, " ").trim();
      
      // Truncate to fit column width roughly
      const maxChars = Math.max(4, Math.floor(colW / 5.2));
      if (str.length > maxChars) {
        str = str.slice(0, maxChars - 2) + "..";
      }

      page.drawText(str, {
        x: currentX + 6,
        y: y - 13,
        size: 7.5,
        font: fontRegular,
        color: textColor,
      });

      currentX += colW;
    });

    y -= rowHeight;
  });

  // Footer for each page
  const totalPages = pdfDoc.getPageCount();
  pdfDoc.getPages().forEach((p, idx) => {
    p.drawLine({
      start: { x: sideMargin, y: bottomMargin + 12 },
      end: { x: sideMargin + contentWidth, y: bottomMargin + 12 },
      thickness: 0.5,
      color: borderColor,
    });

    p.drawText("Badhon (Voluntary Blood Donors' Organization) — Central Operations Ledger", {
      x: sideMargin,
      y: bottomMargin + 2,
      size: 7,
      font: fontRegular,
      color: mutedColor,
    });

    const pageStr = `Page ${idx + 1} of ${totalPages}`;
    const pageStrWidth = fontRegular.widthOfTextAtSize(pageStr, 7);
    p.drawText(pageStr, {
      x: sideMargin + contentWidth - pageStrWidth,
      y: bottomMargin + 2,
      size: 7,
      font: fontRegular,
      color: mutedColor,
    });
  });

  return await pdfDoc.save();
}
