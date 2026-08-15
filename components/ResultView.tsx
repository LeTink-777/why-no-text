"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Sparkles, Unlock } from "lucide-react";
import { NotificationPricing } from "@/components/NotificationPricing";
import {
  DAYS,
  LOCKED_BLOCKS,
  REASONS,
  STATUSES,
  SUBJECT,
  TONES,
  isSubject,
  topReason,
  type DaysId,
  type StatusId,
  type Subject,
  type ToneId,
} from "@/lib/content";
import { readLead } from "@/lib/lead";

export function ResultView() {
  const [subject, setSubject] = useState<Subject>("he");
  const [days, setDays] = useState<DaysId>("d7");
  const [tone, setTone] = useState<ToneId>("neutral");
  const [status, setStatus] = useState<StatusId>("new");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const lead = readLead();
    if (!lead) return;
    if (isSubject(lead.subject)) setSubject(lead.subject);
    if (DAYS.some((item) => item.id === lead.days)) setDays(lead.days as DaysId);
    if (TONES.some((item) => item.id === lead.tone)) setTone(lead.tone as ToneId);
    if (STATUSES.some((item) => item.id === lead.status)) setStatus(lead.status as StatusId);
    setEmail(lead.email ?? "");
  }, []);

  const reason = topReason(days, tone, status);
  const others = REASONS.filter((item) => item.id !== reason.id);

  const daysLabel = DAYS.find((item) => item.id === days)?.label ?? "";
  const toneLabel = TONES.find((item) => item.id === tone)?.label ?? "";
  const statusLabel = STATUSES.find((item) => item.id === status)?.label ?? "";

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-5 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          На главную
        </Link>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs uppercase tracking-[0.15em] text-accent">
          <Unlock className="size-3.5" aria-hidden="true" />
          Анализ готов
        </p>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Самая вероятная причина
        </h1>

        <p className="mt-4 text-sm text-muted">
          {SUBJECT[subject].toggle} · {daysLabel} · {toneLabel.toLowerCase()} · {statusLabel.toLowerCase()}
        </p>

        {/* Free reason */}
        <section className="mt-10 rounded-2xl border border-accent/40 bg-card p-7 sm:p-9">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Причина номер один
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
            {reason.title(subject)}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{reason.text(subject)}</p>
        </section>

        {/* Locked */}
        <section className="mt-16">
          <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-ink">
            <Lock className="size-5 text-accent" aria-hidden="true" />
            Остальные причины закрыты
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Одна причина редко работает в одиночку. В полном разборе показано,
            как они накладываются и что делать в каждом случае.
          </p>

          <div className="mt-6 space-y-3">
            {others.map((item) => (
              <div key={item.id} className="rounded-xl border border-line bg-card px-5 py-4">
                <p className="font-semibold leading-snug text-ink">{item.title(subject)}</p>
                <p className="mt-2 select-none text-sm leading-relaxed text-muted blur-[4.5px]" aria-hidden="true">
                  {item.text(subject).slice(0, 190)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {LOCKED_BLOCKS.map((block) => (
              <div key={block.title} className="rounded-2xl border border-line bg-card p-5">
                <Lock className="size-4 text-accent" aria-hidden="true" />
                <h3 className="mt-3 font-semibold leading-snug text-ink">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{block.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-20">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Открыть полный разбор
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Нажмите на уведомление, чтобы раскрыть состав.
          </p>

          <div className="mt-10">
            <NotificationPricing
              defaultEmail={email}
              context={`Почему не пишет: ${SUBJECT[subject].toggle}, ${daysLabel}, ${toneLabel}, ${statusLabel}`}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
