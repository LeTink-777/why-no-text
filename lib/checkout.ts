import type { PlanId } from "@/lib/plans";
import { saveCheckoutSnapshot, type Lead } from "@/lib/lead";

export interface CheckoutInput {
  plan: PlanId;
  email: string;
  name?: string;
  /** Short free-form note about the visitor's answers, passed to YooKassa metadata. */
  context?: string;
  /** Form answers, echoed back by the webhook into the delivered PDF. */
  answers?: Lead;
}

interface CheckoutResponse {
  confirmationUrl?: string;
  error?: string;
}

/**
 * Creates a YooKassa payment and sends the browser to the payment page.
 * Resolves only when something went wrong — on success the tab navigates away.
 */
export async function startCheckout(input: CheckoutInput): Promise<never | void> {
  // Kept so /thanks can regenerate the PDF after the payment round-trip.
  saveCheckoutSnapshot({
    plan: input.plan,
    answers: { ...(input.answers ?? {}), name: input.name ?? "", email: input.email },
  });

  const response = await fetch("/api/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  let data: CheckoutResponse;
  try {
    data = (await response.json()) as CheckoutResponse;
  } catch {
    throw new Error("Платёжный сервис не ответил. Попробуйте ещё раз.");
  }

  if (!response.ok || !data.confirmationUrl) {
    throw new Error(data.error || "Не удалось создать платёж. Попробуйте ещё раз.");
  }

  window.location.href = data.confirmationUrl;
}
