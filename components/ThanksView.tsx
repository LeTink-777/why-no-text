"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Download, Loader2, Mail, Send } from "lucide-react";
import { readCheckoutSnapshot, type Lead } from "@/lib/lead";
import { PLANS, isPlanId } from "@/lib/plans";
import { SITE } from "@/lib/site";

export function ThanksView({ planFromUrl }: { planFromUrl: string | null }) {
  const [answers, setAnswers] = useState<Lead>({});
  const [plan, setPlan] = useState<string>(planFromUrl ?? "full");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const snapshot = readCheckoutSnapshot();
    if (!snapshot) return;
    setAnswers(snapshot.answers);
    // The URL is authoritative when present — it comes from the return_url.
    if (!planFromUrl) setPlan(snapshot.plan);
  }, [planFromUrl]);

  const selected = isPlanId(plan) ? PLANS[plan] : null;

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: answers,
          plan,
          siteName: SITE.productName,
          accentColor: SITE.accentColor,
        }),
      });

      if (!response.ok) throw new Error("PDF не сформирован");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "result.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Не удалось сформировать PDF. Копия придёт на почту — или напишите нам.");
    }
    setDownloading(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-20">
      <div className="rounded-3xl border border-line bg-card p-8 sm:p-10">
        <CheckCircle2 className="size-12 text-accent" aria-hidden="true" />

        <h1 className="mt-6 font-display text-3xl leading-tight text-ink sm:text-4xl">
          Оплата прошла успешно
        </h1>

        <p className="mt-4 leading-relaxed text-muted">
          {selected ? (
            <>
              Тариф «{selected.name}» оформлен. Результат отправлен на указанную
              почту, полный материал придёт в течение {selected.delivery}.
            </>
          ) : (
            <>
              Результат отправлен на указанную почту. Полный материал придёт в
              срок, указанный в выбранном тарифе.
            </>
          )}
        </p>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-4 text-base font-semibold text-bg transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {downloading ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="size-5" aria-hidden="true" />
          )}
          {downloading ? "Генерируем PDF..." : "Скачать PDF сразу"}
        </button>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-accent">
            {error}
          </p>
        ) : null}

        <p className="mt-3 text-center text-xs text-muted">
          Копия также придёт на вашу почту
        </p>

        <div className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-muted">
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
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
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
  );
}
