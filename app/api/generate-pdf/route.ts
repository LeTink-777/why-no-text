import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf";
import { buildSections } from "@/lib/sections";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  userData?: unknown;
  plan?: unknown;
  siteName?: unknown;
  accentColor?: unknown;
}

function asRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === "string") out[key.slice(0, 40)] = entry.slice(0, 300);
  }
  return out;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    const userData = asRecord(body.userData);
    const plan = typeof body.plan === "string" ? body.plan : "full";
    const siteName = typeof body.siteName === "string" && body.siteName
      ? body.siteName.slice(0, 120)
      : SITE.productName;
    const accentColor =
      typeof body.accentColor === "string" && /^#[0-9a-fA-F]{3,8}$/.test(body.accentColor)
        ? body.accentColor
        : SITE.accentColor;

    const pdfBuffer = await generatePDF({
      title: siteName,
      userName: userData.name || "Дорогой клиент",
      sections: buildSections(userData, plan),
      siteName,
      accentColor,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="result.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[generate-pdf] failed", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
