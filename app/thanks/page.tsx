import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { ThanksView } from "@/components/ThanksView";
import { isPlanId } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Заказ оформлен",
  description: "Страница подтверждения заказа.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ThanksPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.plan;
  const plan = typeof raw === "string" && isPlanId(raw) ? raw : null;

  return (
    <>
      <ThanksView planFromUrl={plan} />
      <SiteFooter />
    </>
  );
}
