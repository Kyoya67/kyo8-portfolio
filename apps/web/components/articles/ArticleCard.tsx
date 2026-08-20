"use client";

import Link from "next/link";
import type { Article } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatDate } from "@/lib/format";
import { ArrowUpRightIcon } from "@/components/icons";

export default function ArticleCard({ article }: { article: Article }) {
  const { locale } = useLocale();
  const external = article.source !== "internal";

  return (
    <Link
      href={article.url}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex flex-col border border-border-strong bg-bg transition-colors hover:bg-bg-inset"
    >
      <div className="flex items-center justify-between border-b border-border-strong px-4 py-2 text-[10px] tracking-[0.15em] text-fg-dim uppercase">
        <span>{article.sourceLabel}</span>
        {external && (
          <ArrowUpRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-[10px] tracking-[0.15em] text-fg-dim uppercase">
          {formatDate(article.publishedAt, locale)}
        </p>
        <h3 className="text-sm font-bold sm:text-base">{article.title[locale]}</h3>
        <p className="text-xs leading-relaxed text-fg-muted sm:text-sm">{article.summary[locale]}</p>
      </div>
    </Link>
  );
}
