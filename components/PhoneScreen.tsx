"use client";

import { motion } from "framer-motion";
import { BatteryMedium, CheckCheck, Signal, Wifi } from "lucide-react";

const SENT = [
  { text: "Привет) как прошли выходные?", time: "пн, 19:42" },
  { text: "Кстати, я нашла то место, про которое рассказывала", time: "вт, 12:08" },
  { text: "Всё нормально?", time: "чт, 21:15" },
];

/** The picture the visitor already has open in another tab. */
export function PhoneScreen() {
  return (
    <div className="mx-auto w-full max-w-[20rem] rounded-[2.25rem] border border-line bg-card p-2.5 shadow-[0_50px_100px_-55px_rgba(88,166,255,0.9)]">
      <div className="overflow-hidden rounded-[1.85rem] bg-bg">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pb-2 pt-3 text-[11px] text-muted">
          <span className="tnum">21:47</span>
          <span className="flex items-center gap-1.5">
            <Signal className="size-3" aria-hidden="true" />
            <Wifi className="size-3" aria-hidden="true" />
            <BatteryMedium className="size-3.5" aria-hidden="true" />
          </span>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span
            aria-hidden="true"
            className="size-9 rounded-full"
            style={{ background: "linear-gradient(140deg, var(--accent-blue), var(--accent-gray))" }}
          />
          <div>
            <p className="text-sm font-medium text-ink">Диалог</p>
            <motion.p
              className="text-[11px] text-muted"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 3.4, repeat: Infinity }}
            >
              был в сети 3 дня назад
            </motion.p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex min-h-[16rem] flex-col justify-end gap-3 px-4 py-5">
          {SENT.map((message, index) => (
            <motion.div
              key={message.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + index * 0.35 }}
              className="flex justify-end"
            >
              <div
                className="max-w-[85%] rounded-2xl px-3.5 py-2.5"
                style={{ background: "var(--accent-blue)", borderBottomRightRadius: "0.35rem" }}
              >
                <p className="text-[13px] leading-snug" style={{ color: "#08131F" }}>
                  {message.text}
                </p>
                <p
                  className="mt-1 flex items-center justify-end gap-1 text-[10px]"
                  style={{ color: "rgba(8,19,31,0.65)" }}
                >
                  {message.time}
                  <CheckCheck className="size-3" aria-hidden="true" />
                </p>
              </div>
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="pt-2 text-center text-[11px] text-muted"
          >
            прочитано · ответа нет
          </motion.p>
        </div>

        {/* Composer */}
        <div className="border-t border-line px-4 py-3">
          <div className="flex items-center rounded-full border border-line px-4 py-2.5">
            <span className="text-[13px] text-muted">Сообщение</span>
            <motion.span
              className="ml-0.5 inline-block h-4 w-px bg-accent"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
