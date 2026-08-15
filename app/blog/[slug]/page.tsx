import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { BLOG_POSTS, getPost } from "@/lib/blog-posts";
import { SITE } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Статья не найдена" };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

/** Content is stored as plain text: "## " starts a subheading, blank lines split paragraphs. */
function renderContent(content: string) {
  return content
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={index} className="mt-10 font-display text-2xl leading-snug text-ink sm:text-3xl">
            {block.slice(3)}
          </h2>
        );
      }
      return (
        <p key={index} className="mt-5 leading-relaxed text-muted">
          {block}
        </p>
      );
    });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    inLanguage: "ru-RU",
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    author: { "@type": "Person", name: SITE.owner.fullName },
    publisher: { "@type": "Organization", name: SITE.owner.fullName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-5 py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Все статьи
          </Link>

          <h1 className="mt-8 font-display text-4xl leading-[1.12] text-ink sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted">{post.description}</p>

          <div className="mt-10 border-t border-line pt-8">{renderContent(post.content)}</div>

          <div className="mt-14 rounded-2xl border border-accent/40 bg-card p-7">
            <p className="font-display text-2xl leading-snug text-ink">{SITE.productName}</p>
            <p className="mt-3 leading-relaxed text-muted">{SITE.description}</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              Перейти к разбору
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
