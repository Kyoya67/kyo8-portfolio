"use client";

import Link from "next/link";
import type { Article } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatDate } from "@/lib/format";
import { PanelFrame } from "@kyo8/ui";
import { PanelHeading } from "@kyo8/ui";
import { ArrowUpRightIcon } from "@kyo8/ui";

export default function ArticlesPreview({ articles }: { articles: Article[] }) {
  const { locale, t } = useLocale();
  const sorted = [...articles]
    .filter((article) => article.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);

  return (
    <div id="articles" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="04" title={t.articles.title} action={{ href: "/articles", label: t.articles.allLink }} />
        <div className="divide-y divide-border">
          {sorted.map((article) => {
            const external = article.source !== "internal";
            return (
              <Link
                key={article.id}
                href={article.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="group flex flex-col gap-3 p-6 transition-colors hover:bg-bg-inset sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8"
              >
                <div>
                  <p className="mb-1.5 text-[10px] tracking-[0.15em] text-fg-dim uppercase">
                    {formatDate(article.publishedAt, locale)} · {article.sourceLabel}
                  </p>
                  <h3 className="text-sm font-bold sm:text-base">{article.title[locale]}</h3>
                  <p className="mt-1 text-xs text-fg-muted sm:text-sm">{article.summary[locale]}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] tracking-[0.1em] text-fg-dim uppercase transition-colors group-hover:text-fg">
                  {t.articles.readLink}
                  <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </PanelFrame>
    </div>
  );
}
