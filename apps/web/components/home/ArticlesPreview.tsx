"use client";

import { useState } from "react";
import type { Article } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatDate } from "@/lib/format";
import { PanelFrame, PanelHeading, ArrowUpRightIcon } from "@kyo8/ui";
import ArticleDetailContent from "@/components/articles/ArticleDetailContent";
import Carousel from "@/components/ui/Carousel";
import Modal from "@/components/ui/Modal";

export default function ArticlesPreview({ articles }: { articles: Article[] }) {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState<Article | null>(null);
  const sorted = [...articles]
    .filter((article) => article.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div id="articles" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="04" title={t.articles.title} />
        <div className="py-6 sm:py-8">
          <Carousel>
            {sorted.map((article) => {
              const external = article.source !== "internal";
              const content = (
                <>
                  <p className="mb-1.5 text-[10px] tracking-[0.15em] text-fg-dim uppercase">
                    {formatDate(article.publishedAt, locale)} · {article.sourceLabel}
                  </p>
                  <h3 className="text-sm font-bold sm:text-base">{article.title[locale]}</h3>
                  <p className="mt-1 text-xs text-fg-muted sm:text-sm">{article.summary[locale]}</p>
                  <span className="mt-3 inline-flex shrink-0 items-center gap-1.5 text-[11px] tracking-[0.1em] text-fg-dim uppercase transition-colors group-hover:text-fg">
                    {t.articles.readLink}
                    <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </>
              );

              return (
                <div key={article.id} className="w-72 shrink-0 snap-start sm:w-80">
                  {external ? (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group block h-full border border-border-strong bg-bg p-6 transition-colors hover:bg-bg-inset"
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelected(article)}
                      className="group block h-full w-full border border-border-strong bg-bg p-6 text-left transition-colors hover:bg-bg-inset"
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </Carousel>
        </div>
      </PanelFrame>

      <Modal open={selected !== null} onClose={() => setSelected(null)}>
        {selected && <ArticleDetailContent article={selected} />}
      </Modal>
    </div>
  );
}
