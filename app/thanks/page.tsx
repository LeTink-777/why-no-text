import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Mail, Send } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE } from "@/lib/site";
import { PLANS, isPlanId } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Заказ оформлен",
  description: "Страница подтверждения заказа.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ThanksPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.plan;
  const planId = typeof raw === "string" && isPlanId(raw) ? raw : null;
  const plan = planId ? PLANS[planId] : null;

  return (
    <>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-20">
        <div className="rounded-3xl border border-line bg-card p-8 sm:p-10">
          <CheckCircle2 className="size-12 text-accent" aria-hidden="true" />

          <h1 className="mt-6 font-display text-3xl leading-tight text-ink sm:text-4xl">
            Спасибо, заказ принят
          </h1>

          <p className="mt-4 leading-relaxed text-muted">
            {plan ? (
              <>
                Тариф «{plan.name}» оформлен. Материал придёт на указанную почту в
                течение {plan.delivery} после подтверждения оплаты.
              </>
            ) : (
              <>
                Материал придёт на указанную почту в срок, указанный в выбранном
                тарифе, после подтверждения оплаты.
              </>
            )}
          </p>

          <div className="mt-8 space-y-3 text-sm text-muted">
            <p className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              Если оплата ещё обрабатывается, письмо придёт чуть позже — это нормально.
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              Не нашли письмо — проверьте папку «Спам» и вкладку «Промоакции».
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={SITE.owner.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              <Send className="size-4" aria-hidden="true" />
              Написать в Telegram
            </a>
            <a
              href={`mailto:${SITE.owner.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="size-4" aria-hidden="true" />
              {SITE.owner.email}
            </a>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Вернуться на главную
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
