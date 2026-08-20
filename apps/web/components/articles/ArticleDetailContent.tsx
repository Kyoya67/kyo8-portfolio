"use client";

import Link from "next/link";
import type { Article } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatDate } from "@/lib/format";

export default function ArticleDetailContent({ article }: { article: Article }) {
  const { locale, t } = useLocale();
  const paragraphs = article.body?.[locale].split("\n\n") ?? [];

  return (
    <div className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_20%_0%,black,transparent)]" />
      <article className="relative mx-auto max-w-3xl px-6 py-20">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-2 text-xs tracking-[0.15em] text-fg-muted uppercase transition-colors hover:text-fg"
        >
          ← {t.articles.backLink}
        </Link>

        <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.3em] text-fg-muted uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-fg" />
          {formatDate(article.publishedAt, locale)} · {article.sourceLabel}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{article.title[locale]}</h1>
        <p className="mt-5 text-sm leading-relaxed text-fg-muted sm:text-base">{article.summary[locale]}</p>

        <div className="mt-12 flex flex-col gap-5 border-t border-border pt-10">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-fg-muted sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
