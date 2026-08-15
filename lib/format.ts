const rub = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

/** 1590 -> "1 590" (with the Russian thin group separator). */
export function formatPrice(value: number): string {
  return rub.format(value);
}

/** 1590 -> "1 590 ₽" */
export function formatRub(value: number): string {
  return `${rub.format(value)} ₽`;
}

/** 390 from 1490 -> 74 */
export function discountPercent(price: number, oldPrice: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function pluralRu(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
