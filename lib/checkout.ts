import type { PlanId } from "@/lib/plans";

export interface CheckoutInput {
  plan: PlanId;
  email: string;
  name?: string;
  /** Short free-form note about the visitor's answers, passed to YooKassa metadata. */
  context?: string;
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
