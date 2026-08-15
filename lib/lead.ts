export type Lead = Record<string, string>;

const KEY = "lead";

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
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
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

export function clearLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to do.
  }
}
