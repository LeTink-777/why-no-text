"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  Flame,
  Loader2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useCountdown } from "@/components/Countdown";
import { useSpots } from "@/components/Spots";
import { startCheckout } from "@/lib/checkout";
import { discountPercent, formatPrice } from "@/lib/format";
import { PLAN_LIST, type PlanId } from "@/lib/plans";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SUBTITLE: Record<PlanId, string> = {
  basic: "Топ-3 причины и что они значат",
  full: "Все причины, что делать и скрипты",
  premium: "Полный разбор и персональный совет",
};

export function NotificationPricing({
  defaultEmail = "",
  context = "",
}: {
  defaultEmail?: string;
  context?: string;
}) {
  const uid = useId();
  const [expanded, setExpanded] = useState<PlanId | null>("full");
  const [selected, setSelected] = useState<PlanId>("full");
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const countdown = useCountdown(24);
  const spots = useSpots(2, 4);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  const plan = PLAN_LIST.find((item) => item.id === selected) ?? PLAN_LIST[1];

  async function handlePay() {
    if (!EMAIL_RE.test(email.trim())) {
      setError("Укажите почту, на которую отправить разбор");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await startCheckout({ plan: plan.id, email: email.trim().toLowerCase(), context });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось создать платёж.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="space-y-3">
        {PLAN_LIST.map((item, index) => {
          const isOpen = expanded === item.id;
          const isSelected = selected === item.id;
          const accent = item.popular;

          return (
            <motion.div
              key={item.id}
              // Notifications drop in one after another, like on a lock screen.
              initial={{ opacity: 0, y: -26, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: index * 0.5, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border backdrop-blur"
              style={{
                borderColor: isSelected ? "var(--accent-blue)" : "var(--line)",
                background: accent ? "rgba(88,166,255,0.08)" : "var(--bg-card)",
                boxShadow: isSelected ? "0 24px 60px -40px rgba(88,166,255,0.95)" : "none",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setExpanded(isOpen ? null : item.id);
                  setSelected(item.id);
                }}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3.5 px-5 py-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[0.7rem]"
                  style={{ background: accent ? "var(--accent-blue)" : "var(--elev)" }}
                >
                  <MessageSquare
                    className="size-4"
                    style={{ color: accent ? "#08131F" : "var(--accent-blue)" }}
                    aria-hidden="true"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{item.name}</span>
                    <span className="shrink-0 text-[11px] text-muted">сейчас</span>
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted">{SUBTITLE[item.id]}</span>
                  <span className="mt-2 flex items-baseline gap-2.5">
                    <span className="tnum text-lg font-semibold text-ink">
                      {formatPrice(item.price)} ₽
                    </span>
                    <span className="tnum text-xs text-muted line-through">
                      {formatPrice(item.oldPrice)} ₽
                    </span>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">
                      -{discountPercent(item.price, item.oldPrice)}%
                    </span>
                  </span>
                </span>

                <ChevronDown
                  className="mt-1 size-4 shrink-0 text-muted transition-transform"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-line px-5 py-4">
                      <ul className="space-y-2.5">
                        {item.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
                          >
                            <Check className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {item.timer ? (
                        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1.5 text-[11px] text-accent">
                          <Clock className="size-3" aria-hidden="true" />
                          Акция истекает:{" "}
                          <span className="tnum font-semibold" suppressHydrationWarning>
                            {countdown.text}
                          </span>
                        </p>
                      ) : null}

                      {item.spots ? (
                        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] text-muted">
                          <Flame className="size-3 text-accent" aria-hidden="true" />
                          <span suppressHydrationWarning>Советов на этой неделе: {spots ?? 4}</span>
                        </p>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Checkout */}
      <div className="mt-8 rounded-2xl border border-line bg-card p-6">
        <label htmlFor={`${uid}-email`} className="mb-2 block text-sm text-muted">
          Куда отправить разбор
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

        {error ? (
          <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-accent">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handlePay}
          disabled={pending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          style={{ background: "var(--accent-blue)", color: "#08131F" }}
        >
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
          Оплатить «{plan.name}» — {formatPrice(plan.price)} ₽
        </button>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Оплата через ЮKassa — все подключённые способы доступны на странице оплаты.
        </p>
      </div>
    </div>
  );
}
