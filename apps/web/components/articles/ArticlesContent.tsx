"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@kyo8/ui";
import ArticleCard from "@/components/articles/ArticleCard";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Article, ArticleSource } from "@/types";

type Filter = "all" | ArticleSource;

export default function ArticlesContent({ articles }: { articles: Article[] }) {
  const { t } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const published = useMemo(
    () => [...articles].filter((article) => article.published).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [articles]
  );

  const sourcesPresent = useMemo(
    () => Array.from(new Set(published.map((article) => article.source))),
    [published]
  );

  const filtered = filter === "all" ? published : published.filter((article) => article.source === filter);

  const filters: Filter[] = ["all", ...sourcesPresent];

  return (
    <>
      <PageHeader eyebrow={t.articles.eyebrow} title={t.articles.title} description={t.articles.pageDescription} />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`border px-3.5 py-2 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                filter === f
                  ? "border-fg bg-fg text-bg"
                  : "border-border-strong text-fg-muted hover:border-fg hover:text-fg"
              }`}
            >
              {f === "all" ? t.articles.allFilter : t.articles.sourceLabels[f]}
            </button>
          ))}
        </div>

        <p className="mb-8 text-xs text-fg-dim">{t.articles.postsCount(filtered.length)}</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
