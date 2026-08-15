import Link from "next/link";
import { FileText, Mail, Send, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-card/60">
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="font-display text-lg text-ink">{SITE.productName}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Материалы носят информационный характер и не заменяют консультацию
              специалиста. Решения вы принимаете самостоятельно.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Документы</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
                  >
                    <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link
                    href="/offer"
                    className="inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
                  >
                    <FileText className="size-4 shrink-0" aria-hidden="true" />
                    Публичная оферта
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Связь</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href={`mailto:${SITE.owner.email}`}
                    className="inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden="true" />
                    {SITE.owner.email}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.owner.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
                  >
                    <Send className="size-4 shrink-0" aria-hidden="true" />
                    {SITE.owner.telegram}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          <p>
            {SITE.owner.fullName}. ИНН {SITE.owner.inn}. {SITE.owner.status}.
          </p>
          <p className="mt-1">Оплата через ЮKassa. Все доступные способы оплаты показываются на странице оплаты.</p>
        </div>
      </div>
    </footer>
  );
}
