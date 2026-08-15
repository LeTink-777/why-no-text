import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <main className="mx-auto w-full max-w-3xl px-5 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          На главную
        </Link>

        <h1 className="mt-8 font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">Редакция от {updated}</p>

        <div className="legal mt-10 space-y-6 text-[15px] leading-relaxed text-muted">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-ink">{heading}</h2>
      {children}
    </section>
  );
}
