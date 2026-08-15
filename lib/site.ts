const FALLBACK_URL = "https://why-no-text.vercel.app";

/**
 * Canonical origin for metadata, sitemap.xml and robots.txt.
 * NEXT_PUBLIC_SITE_URL wins when set (local development, custom domain),
 * otherwise Vercel's own production URL is used so the deployed site is
 * correct even if the assigned subdomain differs from the placeholder.
 */
function resolveUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return FALLBACK_URL;
}

export const SITE = {
  domain: "why-no-text.vercel.app",
  url: resolveUrl(),
  productName: "Разбор «Почему он не пишет»",
  productKind: "цифровой информационный продукт (PDF-разбор и аудиокомментарий)",
  title: "Почему он не пишет — психология и реальные причины",
  description: "Узнайте почему он или она не пишет. Реальные причины с точки зрения психологии. Бесплатный анализ вашей ситуации по 3 вопросам.",
  keywords: [
      "почему он не пишет",
      "почему она не пишет",
      "не пишет психология",
      "почему парень пропал",
      "почему девушка не отвечает",
      "игнорирует психология",
      "читает и не отвечает"
  ] as string[],
  legalUpdated: "15 августа 2026",
  legalUpdatedISO: "2026-08-15",
  owner: {
    fullName: "Евдокимов Даниил Владимирович",
    inn: "381928138362",
    status: "Самозанятый (плательщик НПД)",
    email: "danyavdkmvv3@gmail.com",
    telegram: "@dvdkmv",
    telegramUrl: "https://t.me/dvdkmv",
  },
} as const;
