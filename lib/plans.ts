export type PlanId = "basic" | "full" | "premium";

export interface Plan {
  id: PlanId;
  /** Shown on the pricing card. */
  name: string;
  price: number;
  oldPrice: number;
  /** Goes into the YooKassa payment description. */
  yooDescription: string;
  /** Delivery window promised for this plan. */
  delivery: string;
  features: string[];
  /** Renders the offer countdown on this plan. */
  timer?: boolean;
  /** Renders the remaining-slots counter on this plan. */
  spots?: boolean;
  /** Highlighted as the recommended plan. */
  popular?: boolean;
  /** Position of the plan on the depth slider, in percent. */
  depth?: number;
  /** Number of months the calendar plan covers. */
  months?: number;
}

export const PLANS: Record<PlanId, Plan> = {
  basic: {
    id: "basic",
    name: "Базовый анализ",
    price: 250,
    oldPrice: 790,
    yooDescription: "Почему не пишет базовый анализ",
    delivery: "24 часа",
    features: [
      "Топ-3 причины молчания",
      "Что означает каждая из них",
      "PDF 6 страниц",
      "Email за 24 часа",
    ],
  },
  full: {
    id: "full",
    name: "Полный разбор",
    price: 490,
    oldPrice: 1990,
    yooDescription: "Почему не пишет полный разбор",
    delivery: "12 часов",
    features: [
      "Все возможные причины молчания",
      "Что делать в каждом случае",
      "Стоит ли писать первой",
      "Скрипты сообщений",
      "PDF 18 страниц",
      "Email за 12 часов",
    ],
    timer: true,
    popular: true,
  },
  premium: {
    id: "premium",
    name: "Разбор и совет",
    price: 990,
    oldPrice: 3490,
    yooDescription: "Почему не пишет разбор и совет",
    delivery: "6 часов",
    features: [
      "Всё из полного разбора",
      "Персональный совет по вашей ситуации",
      "Аудиокомментарий 10 минут",
      "Email за 6 часов",
    ],
    spots: true,
  },
};

export const PLAN_IDS: PlanId[] = ["basic", "full", "premium"];

export const PLAN_LIST: Plan[] = PLAN_IDS.map((id) => PLANS[id]);

export function isPlanId(value: string): value is PlanId {
  return (PLAN_IDS as string[]).includes(value);
}
