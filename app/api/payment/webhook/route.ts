import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf";
import { sendResultEmail } from "@/lib/email";
import { buildSections } from "@/lib/sections";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// PDF rendering plus the Resend call needs more than the default budget.
export const maxDuration = 60;

interface YooKassaNotification {
  event?: string;
  object?: {
    id?: string;
    status?: string;
    paid?: boolean;
    amount?: { value?: string; currency?: string };
    metadata?: Record<string, string>;
  };
}

/**
 * YooKassa notification endpoint.
 *
 * Register this URL in the merchant dashboard (Интеграция → HTTP-уведомления)
 * for `payment.succeeded` and `payment.canceled`. It always answers 200 so a
 * delivery failure on our side does not make YooKassa retry forever — failures
 * are logged and the order is fulfilled manually.
 */
export async function POST(request: Request) {
  let notification: YooKassaNotification;
  try {
    notification = (await request.json()) as YooKassaNotification;
  } catch {
    return NextResponse.json({ received: true });
  }

  const payment = notification.object;

  if (notification.event === "payment.canceled") {
    console.info("[webhook] canceled", { id: payment?.id, plan: payment?.metadata?.plan });
    return NextResponse.json({ received: true });
  }

  if (notification.event !== "payment.succeeded" || !payment?.paid) {
    return NextResponse.json({ received: true });
  }

  const metadata = payment.metadata || {};
  const userEmail = metadata.userEmail || metadata.email || "";
  const userName = metadata.userName || metadata.customer_name || "Дорогой клиент";
  const plan = metadata.plan || "full";

  console.info("[webhook] paid", {
    id: payment.id,
    amount: payment.amount?.value,
    plan,
    email: userEmail,
  });

  if (!userEmail) {
    console.warn("[webhook] no email in metadata, skipping delivery", { id: payment.id });
    return NextResponse.json({ received: true });
  }

  try {
    const sections = buildSections(metadata, plan);

    const pdfBuffer = await generatePDF({
      title: SITE.productName,
      userName,
      sections,
      siteName: SITE.productName,
      accentColor: SITE.accentColor,
    });

    await sendResultEmail({
      to: userEmail,
      subject: `${SITE.productName} — ваш результат готов`,
      userName,
      resultHtml: sections
        .map(
          (section) =>
            `<h3 style="font-size:16px;margin:20px 0 6px;">${section.title}</h3>` +
            `<p style="font-size:14px;line-height:1.6;white-space:pre-line;margin:0;">${section.content}</p>`,
        )
        .join(""),
      pdfBuffer,
      fileName: "result.pdf",
      siteName: SITE.productName,
      accentColor: SITE.accentColor,
    });

    console.info("[webhook] delivered", { id: payment.id, to: userEmail });
  } catch (error) {
    // Never fail the webhook: YooKassa would keep retrying a payment we already
    // recorded. The log is the signal to fulfil this order by hand.
    console.error("[webhook] delivery failed", { id: payment.id, to: userEmail, error });
  }

  return NextResponse.json({ received: true });
}
