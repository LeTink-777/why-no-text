"use client";

import { useEffect, useState } from "react";

/**
 * Remaining slots for the hands-on plan. The number is derived from the current
 * date so it stays put while the visitor reads the page and only moves day to
 * day — it is computed after mount to keep the server markup stable.
 */
export function useSpots(min = 2, max = 4): number | null {
  const [spots, setSpots] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const span = max - min + 1;
    const hash = (Math.imul(seed, 2654435761) >>> 0) % span;
    setSpots(min + hash);
  }, [min, max]);

  return spots;
}

export function Spots({
  className = "",
  min = 2,
  max = 4,
  label = "Осталось мест:",
}: {
  className?: string;
  min?: number;
  max?: number;
  label?: string;
}) {
  const spots = useSpots(min, max);
  return (
    <span className={className} suppressHydrationWarning>
      {label} {spots ?? max}
    </span>
  );
}
