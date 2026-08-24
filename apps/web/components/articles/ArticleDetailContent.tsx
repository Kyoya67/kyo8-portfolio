"use client";

import type { Article } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatDate } from "@/lib/format";

export default function ArticleDetailContent({ article }: { article: Article }) {
  const { locale } = useLocale();
  const paragraphs = article.body?.[locale].split("\n\n") ?? [];

  return (
    <article className="p-6 sm:p-10">
      <p className="mb-4 flex items-center gap-2 pr-8 text-xs tracking-[0.3em] text-fg-muted uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-fg" />
        {formatDate(article.publishedAt, locale)} · {article.sourceLabel}
      </p>
      <h1 className="pr-8 text-2xl font-bold tracking-tight sm:text-3xl">{article.title[locale]}</h1>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted sm:text-base">{article.summary[locale]}</p>

      <div className="mt-8 flex flex-col gap-5 border-t border-border pt-8">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-fg-muted sm:text-base">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
