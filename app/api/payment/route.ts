import { NextResponse } from "next/server";
import { PLANS, isPlanId } from "@/lib/plans";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const YOOKASSA_API = "https://api.yookassa.ru/v3/payments";

interface YooKassaPayment {
  id: string;
  status: string;
  confirmation?: { type: string; confirmation_url?: string };
}

interface CreatePaymentBody {
  plan?: unknown;
  email?: unknown;
  name?: unknown;
  context?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** YooKassa caps `description` at 128 characters. */
function trim128(value: string): string {
  return value.length > 128 ? `${value.slice(0, 125)}...` : value;
}

export async function POST(request: Request) {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    console.error("[payment] YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY are not configured");
    return NextResponse.json(
      { error: "Приём платежей временно недоступен. Напишите нам и мы оформим заказ вручную." },
      { status: 503 },
    );
  }

  let body: CreatePaymentBody;
  try {
    body = (await request.json()) as CreatePaymentBody;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const planId = asString(body.plan, 32);
  if (!isPlanId(planId)) {
    return NextResponse.json({ error: "Выберите тариф." }, { status: 400 });
  }

  const email = asString(body.email, 190).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Укажите корректный email для доставки." }, { status: 400 });
  }

  const plan = PLANS[planId];
  const customerName = asString(body.name, 120);
  const context = asString(body.context, 240);

  const origin = new URL(request.url).origin;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || SITE.url;
  const returnUrl = `${baseUrl.replace(/\/$/, "")}/thanks?plan=${plan.id}`;

  // No payment_method_type is sent on purpose: YooKassa then shows every
  // method enabled for the shop (card, SBP, SberPay, wallets, installments).
  const payload: Record<string, unknown> = {
    amount: { value: plan.price.toFixed(2), currency: "RUB" },
    capture: true,
    description: trim128(`${SITE.productName}. ${plan.yooDescription}`),
    confirmation: { type: "redirect", return_url: returnUrl },
    metadata: {
      plan: plan.id,
      plan_name: plan.name,
      site: SITE.domain,
      email,
      ...(customerName ? { customer_name: customerName } : {}),
      ...(context ? { context } : {}),
    },
  };

  // Fiscalisation is opt-in: a self-employed merchant issues the receipt in
  // "Мой налог", so a receipt object is only sent when the shop is set up for it.
  if (process.env.YOOKASSA_SEND_RECEIPT === "true") {
    payload.receipt = {
      customer: { email },
      items: [
        {
          description: trim128(plan.yooDescription),
          quantity: "1.00",
          amount: { value: plan.price.toFixed(2), currency: "RUB" },
          vat_code: 1,
          payment_mode: "full_payment",
          payment_subject: "service",
        },
      ],
    };
  }

  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

  let response: Response;
  try {
    response = await fetch(YOOKASSA_API, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Idempotence-Key": crypto.randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error) {
    console.error("[payment] network error", error);
    return NextResponse.json(
      { error: "Платёжный сервис недоступен. Попробуйте ещё раз через минуту." },
      { status: 502 },
    );
  }

  const raw = await response.text();
  if (!response.ok) {
    // The upstream body can contain merchant details, so it is logged but not returned.
    console.error("[payment] YooKassa error", response.status, raw);
    return NextResponse.json(
      { error: "Не удалось создать платёж. Попробуйте ещё раз или напишите нам." },
      { status: 502 },
    );
  }

  let payment: YooKassaPayment;
  try {
    payment = JSON.parse(raw) as YooKassaPayment;
  } catch {
    console.error("[payment] unparsable YooKassa response", raw);
    return NextResponse.json({ error: "Не удалось создать платёж." }, { status: 502 });
  }

  const confirmationUrl = payment.confirmation?.confirmation_url;
  if (!confirmationUrl) {
    console.error("[payment] missing confirmation_url", raw);
    return NextResponse.json({ error: "Не удалось создать платёж." }, { status: 502 });
  }

  return NextResponse.json({ id: payment.id, confirmationUrl });
}
