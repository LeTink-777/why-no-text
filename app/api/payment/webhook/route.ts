import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
 * for the `payment.succeeded` and `payment.canceled` events. It always answers
 * 200 so YooKassa does not retry a notification we have already seen.
 */
export async function POST(request: Request) {
  let notification: YooKassaNotification;
  try {
    notification = (await request.json()) as YooKassaNotification;
  } catch {
    return NextResponse.json({ received: true });
  }

  const payment = notification.object;

  if (notification.event === "payment.succeeded" && payment?.paid) {
    console.info("[webhook] paid", {
      id: payment.id,
      amount: payment.amount?.value,
      plan: payment.metadata?.plan,
      email: payment.metadata?.email,
    });
    // Delivery is manual today: the order lands in the logs and the material is
    // sent from the owner's mailbox within the window promised by the plan.
  } else if (notification.event === "payment.canceled") {
    console.info("[webhook] canceled", { id: payment?.id, plan: payment?.metadata?.plan });
  }

  return NextResponse.json({ received: true });
}
