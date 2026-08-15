import { HelpCircle } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Visible FAQ. The same questions and answers are emitted as FAQPage JSON-LD
 * in the layout — Google requires the answer text to be present on the page,
 * so this component and the markup must stay in sync (both read SITE.faq).
 */
export function Faq({ className = "" }: { className?: string }) {
  return (
    <section className={`border-t border-line ${className}`} aria-labelledby="faq-heading">
      <div className="mx-auto w-full max-w-3xl px-5 py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs uppercase tracking-[0.18em] text-accent">
          <HelpCircle className="size-3.5" aria-hidden="true" />
          Частые вопросы
        </p>

        <h2
          id="faq-heading"
          className="mt-6 font-display text-3xl leading-tight text-ink sm:text-4xl"
        >
          Что обычно спрашивают
        </h2>

        <dl className="mt-10 space-y-4">
          {SITE.faq.map((item) => (
            <div key={item.q} className="rounded-2xl border border-line bg-card p-6">
              <dt className="font-display text-xl leading-snug text-ink">{item.q}</dt>
              <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
