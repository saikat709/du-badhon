import { NextRequest, NextResponse } from "next/server";
import { generateDonationReportPdf, PdfReportPayload } from "@/lib/pdf-generator";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PdfReportPayload;

    if (!body || !Array.isArray(body.headers) || !Array.isArray(body.rows)) {
      return NextResponse.json(
        { error: "Invalid payload: 'headers' and 'rows' are required arrays." },
        { status: 400 }
      );
    }

    const pdfBytes = await generateDonationReportPdf(body);
    const filename = (body.title || "badhon_report")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")
      .concat(".pdf");

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error("PDF generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
