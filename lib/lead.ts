export type Lead = Record<string, string>;

const KEY = "lead";
const CHECKOUT_KEY = "checkout_snapshot";

/** The landing form hands the result page its answers through sessionStorage,
 *  which keeps the email out of the URL and out of any referrer header. */
export function saveLead(lead: Lead): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(lead));
  } catch {
    // Private mode or a full quota — the result page falls back to its prompt.
  }
}

export function readLead(): Lead | null {
  if (typeof window === "undefined") return null;
  return parse(safeGet(window.sessionStorage, KEY));
}

export function clearLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to do.
  }
}

export interface CheckoutSnapshot {
  plan: string;
  answers: Lead;
}

/**
 * Saved before handing the visitor to YooKassa. localStorage rather than
 * sessionStorage because the payment flow leaves the origin and comes back,
 * and some browsers hand the return navigation a fresh session store.
 */
export function saveCheckoutSnapshot(snapshot: CheckoutSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify(snapshot));
  } catch {
    // The thanks page falls back to its defaults.
  }
}

export function readCheckoutSnapshot(): CheckoutSnapshot | null {
  if (typeof window === "undefined") return null;
  const raw = safeGet(window.localStorage, CHECKOUT_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const value = parsed as { plan?: unknown; answers?: unknown };
    return {
      plan: typeof value.plan === "string" ? value.plan : "full",
      answers: parse(typeof value.answers === "string" ? value.answers : JSON.stringify(value.answers)) ?? {},
    };
  } catch {
    return null;
  }
}

function safeGet(store: Storage, key: string): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Lead | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const lead: Lead = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string") lead[key] = value;
    }
    return lead;
  } catch {
    return null;
  }
}
