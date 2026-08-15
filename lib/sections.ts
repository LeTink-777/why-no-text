import type { PdfSection } from "@/lib/pdf";
import { PLANS, isPlanId } from "@/lib/plans";
import { formatRub } from "@/lib/format";

/** Human labels for the answers each funnel collects. */
const FIELD_LABELS: Record<string, string> = {
  name: "Имя",
  partner: "Имя партнёра",
  birthday: "Дата рождения",
  gender: "Пол",
  platform: "Платформа",
  first: "Первый знак",
  second: "Второй знак",
  initiator: "Инициатор расставания",
  period: "Прошло времени",
  subject: "О ком вопрос",
  days: "Дней без сообщений",
  tone: "Последнее общение",
  status: "Статус отношений",
  percent: "Результат теста",
  code: "Денежный код",
  personal: "Личное число",
};

/** Fields that are internal plumbing rather than something to print. */
const SKIP = new Set(["email", "answers", "plan", "context"]);

export function buildSections(
  userData: Record<string, string>,
  plan: string,
): PdfSection[] {
  const sections: PdfSection[] = [];

  const answers = Object.entries(userData)
    .filter(([key, value]) => !SKIP.has(key) && value && FIELD_LABELS[key])
    .map(([key, value]) => `${FIELD_LABELS[key]}: ${value}`);

  if (answers.length) {
    sections.push({ title: "Ваши данные", content: answers.join("\n") });
  }

  if (isPlanId(plan)) {
    const selected = PLANS[plan];
    sections.push({
      title: `Тариф «${selected.name}» — ${formatRub(selected.price)}`,
      content: selected.features.map((feature) => `• ${feature}`).join("\n"),
    });
    sections.push({
      title: "Срок передачи материала",
      content: `Полный материал по тарифу «${selected.name}» будет направлен на указанную почту в течение ${selected.delivery} с момента подтверждения оплаты. Этот файл подтверждает состав заказа.`,
    });
  } else {
    sections.push({
      title: "Состав заказа",
      content: "Тариф не распознан. Напишите нам, и мы уточним состав заказа вручную.",
    });
  }

  sections.push({
    title: "Поддержка",
    content:
      "Если письмо с материалом не пришло, проверьте папку «Спам» и вкладку «Промоакции». Мы отвечаем на любые вопросы по заказу в течение рабочего дня.",
  });

  return sections;
}
