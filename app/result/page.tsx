import type { Metadata } from "next";
import { ResultView } from "@/components/ResultView";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Почему он не пишет — ваш результат",
  description:
    "Самая вероятная причина молчания с разбором психологического механизма — бесплатно. Все причины, что делать в каждом случае и скрипты — в полном разборе.",
  alternates: { canonical: "/result" },
};

export default function ResultPage() {
  return (
    <>
      <ResultView />
      <SiteFooter />
    </>
  );
}
