"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import {
  DAYS,
  STATUSES,
  SUBJECT,
  TONES,
  type DaysId,
  type StatusId,
  type Subject,
  type ToneId,
} from "@/lib/content";
import { saveLead } from "@/lib/lead";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Choice<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 3,
}: {
  legend: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm text-muted">{legend}</legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.id)}
              className="rounded-xl border px-3 py-2.5 text-[13px] transition-colors"
              style={{
                borderColor: active ? "var(--accent-blue)" : "var(--line)",
                background: active ? "rgba(88,166,255,0.12)" : "transparent",
                color: active ? "var(--accent-blue)" : "var(--text-secondary)",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function QuizForm() {
  const router = useRouter();
  const uid = useId();
  const [subject, setSubject] = useState<Subject>("he");
  const [days, setDays] = useState<DaysId>("d7");
  const [tone, setTone] = useState<ToneId>("neutral");
  const [status, setStatus] = useState<StatusId>("new");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Проверьте адрес электронной почты");
      return;
    }
    setError(null);
    setPending(true);
    saveLead({ subject, days, tone, status, email: email.trim().toLowerCase() });
    router.push("/result");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-line bg-card p-6 sm:p-7"
    >
      {/* Subject toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-bg p-1.5">
        {(Object.keys(SUBJECT) as Subject[]).map((value) => {
          const active = subject === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setSubject(value)}
              className="relative rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              style={{ color: active ? "#08131F" : "var(--text-secondary)" }}
            >
              {active ? (
                <motion.span
                  layoutId={`${uid}-subject`}
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--accent-blue)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span className="relative">{SUBJECT[value].toggle}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-5">
        <Choice legend="Сколько дней прошло?" options={DAYS} value={days} onChange={setDays} />
        <Choice legend="Последнее общение было:" options={TONES} value={tone} onChange={setTone} />
        <Choice
          legend="Вы встречались или только знакомы?"
          options={STATUSES}
          value={status}
          onChange={setStatus}
          columns={2}
        />
      </div>

      <div className="mt-6">
        <label htmlFor={`${uid}-email`} className="mb-2 block text-sm text-muted">
          Email
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
        />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-accent">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        style={{ background: "var(--accent-blue)", color: "#08131F" }}
      >
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-5" aria-hidden="true" />
        )}
        Узнать причину бесплатно
      </button>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Анализ по трём вопросам — ориентир, а не диагноз. Почта нужна только для
        доставки разбора.
      </p>
    </form>
  );
}
