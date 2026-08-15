import { Brain, Eye, MessageCircleOff, Timer } from "lucide-react";
import { PhoneScreen } from "@/components/PhoneScreen";
import { QuizForm } from "@/components/QuizForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE } from "@/lib/site";
import { REASONS } from "@/lib/content";

const NOTES = [
  {
    icon: Brain,
    title: "Молчание почти никогда не значит то, что кажется",
    text: "В тишине мозг достраивает худший сценарий, потому что неопределённость переносится тяжелее плохой новости. Первое, что делает разбор, — возвращает список реальных вариантов.",
  },
  {
    icon: Timer,
    title: "Время меняет причину",
    text: "Три дня и три недели — это разные ситуации с разными причинами и разными действиями. Универсального ответа «просто подожди» не существует.",
  },
  {
    icon: Eye,
    title: "Прочитал и не ответил — не приговор",
    text: "Открытое сообщение без ответа чаще означает «отвечу, когда смогу сформулировать», чем «мне не интересно». Отличить одно от другого можно по конкретным признакам.",
  },
];

export default function HomePage() {
  return (
    <>
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-32 h-[500px]"
            style={{
              background:
                "radial-gradient(50% 50% at 30% 30%, rgba(88,166,255,0.16) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs uppercase tracking-[0.15em] text-accent">
                <MessageCircleOff className="size-3.5" aria-hidden="true" />
                Анализ по 3 вопросам
              </p>

              <h1 className="mt-7 text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[3.4rem]">
                Почему он не пишет — <span className="text-accent">реальные причины</span> и что с
                этим делать
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Шесть причин молчания, за каждой из которых стоит понятный
                психологический механизм. Ответьте на три вопроса — и увидите
                самую вероятную для вашей ситуации.
              </p>

              <div className="mt-10 max-w-md">
                <QuizForm />
              </div>
            </div>

            <div className="lg:pl-6">
              <PhoneScreen />
              <p className="mt-5 text-center text-xs text-muted">
                Знакомая картина — и она почти никогда не значит того, что кажется
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-card/50">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Что происходит на самом деле
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {NOTES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-line bg-card p-6">
                  <Icon className="size-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Шесть причин молчания
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            Бесплатный анализ показывает ту, которая вероятнее всего описывает
            вашу ситуацию, с полным объяснением механизма.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((reason) => (
              <div key={reason.id} className="rounded-2xl border border-line bg-card p-5">
                <p className="font-semibold leading-snug text-ink">{reason.title("he")}</p>
              </div>
            ))}
          </div>

          <p className="mt-16 text-center text-xs text-muted">
            {SITE.owner.fullName}. ИНН {SITE.owner.inn}. {SITE.owner.status}.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
