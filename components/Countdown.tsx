"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "offer_deadline";

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export interface CountdownState {
  /** false until the effect has run, so server and client render the same markup. */
  ready: boolean;
  hours: string;
  minutes: string;
  seconds: string;
  text: string;
  expired: boolean;
}

/**
 * A rolling offer window. The deadline is persisted so a reload does not hand
 * the visitor a fresh 24 hours, and it restarts once the window has passed.
 */
export function useCountdown(hours = 24): CountdownState {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const windowMs = hours * 60 * 60 * 1000;

    const readDeadline = (): number => {
      const now = Date.now();
      let deadline = 0;
      try {
        deadline = Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
      } catch {
        deadline = 0;
      }
      if (!deadline || deadline <= now) {
        deadline = now + windowMs;
        try {
          window.localStorage.setItem(STORAGE_KEY, String(deadline));
        } catch {
          // Storage unavailable — the timer still runs for this page view.
        }
      }
      return deadline;
    };

    const deadline = readDeadline();
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hours]);

  if (remaining === null) {
    return {
      ready: false,
      hours: pad(hours),
      minutes: "00",
      seconds: "00",
      text: `${pad(hours)}:00:00`,
      expired: false,
    };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hh = pad(Math.floor(totalSeconds / 3600));
  const mm = pad(Math.floor((totalSeconds % 3600) / 60));
  const ss = pad(totalSeconds % 60);

  return {
    ready: true,
    hours: hh,
    minutes: mm,
    seconds: ss,
    text: `${hh}:${mm}:${ss}`,
    expired: remaining === 0,
  };
}

export function Countdown({ className = "", hours = 24 }: { className?: string; hours?: number }) {
  const { text } = useCountdown(hours);
  return (
    <span className={`tnum ${className}`} suppressHydrationWarning>
      {text}
    </span>
  );
}
