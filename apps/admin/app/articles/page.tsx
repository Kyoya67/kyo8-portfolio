"use client";

import { useCallback, useEffect, useState } from "react";
import type { Article, ArticleSource } from "@/types";
import { createArticle, deleteArticle, listArticles, updateArticle } from "@/lib/api/articles";
import { PanelFrame, PanelHeading } from "@kyo8/ui";

const SOURCES: ArticleSource[] = ["internal", "zenn", "external"];

function newId(): string {
  return `a-${Math.random().toString(36).slice(2, 10)}`;
}

function newArticle(): Article {
  return {
    id: newId(),
    slug: null,
    title: { en: "", ja: "" },
    summary: { en: "", ja: "" },
    body: { en: "", ja: "" },
    url: "",
    source: "internal",
    sourceLabel: "",
    publishedAt: "",
    published: false,
    order: 1,
  };
}

interface RowStatus {
  saving: boolean;
  error: string | null;
  saved: boolean;
}

const IDLE_STATUS: RowStatus = { saving: false, error: null, saved: false };

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, RowStatus>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listArticles();
      setArticles(data);
      setNewIds(new Set());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount; `load` also drives the retry button.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function getStatus(id: string): RowStatus {
    return status[id] ?? IDLE_STATUS;
  }

  function setRowStatus(id: string, patch: Partial<RowStatus>) {
    setStatus((prev) => ({ ...prev, [id]: { ...IDLE_STATUS, ...prev[id], ...patch } }));
  }

  function updateArticleField(id: string, patch: Partial<Article>) {
    setArticles((prev) => prev?.map((a) => (a.id === id ? { ...a, ...patch } : a)) ?? prev);
    setRowStatus(id, { saved: false });
  }

  function addArticle() {
    const article = newArticle();
    setArticles((prev) => [...(prev ?? []), article]);
    setNewIds((prev) => new Set(prev).add(article.id));
  }

  async function handleSave(article: Article) {
    setRowStatus(article.id, { saving: true, error: null, saved: false });
    try {
      if (newIds.has(article.id)) {
        await createArticle(article);
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(article.id);
          return next;
        });
      } else {
        await updateArticle(article);
      }
      setRowStatus(article.id, { saving: false, saved: true });
    } catch (err) {
      setRowStatus(article.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to save article",
      });
    }
  }

  async function handleDelete(article: Article) {
    if (newIds.has(article.id)) {
      setArticles((prev) => prev?.filter((a) => a.id !== article.id) ?? prev);
      return;
    }
    setRowStatus(article.id, { saving: true, error: null });
    try {
      await deleteArticle(article.id);
      setArticles((prev) => prev?.filter((a) => a.id !== article.id) ?? prev);
    } catch (err) {
      setRowStatus(article.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to delete article",
      });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="05" title="Articles" />
          <div className="px-6 py-14 text-center">
            <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
              Loading articles<span className="animate-blink">_</span>
            </p>
          </div>
        </PanelFrame>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="05" title="Articles" />
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <p className="text-xs text-red-400">{loadError}</p>
            <button
              type="button"
              onClick={load}
              className="group inline-flex items-center gap-2 border border-border-strong px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase transition-colors hover:border-fg hover:text-fg"
            >
              <span className="text-fg-dim group-hover:text-current">›</span>
              Retry
            </button>
          </div>
        </PanelFrame>
      </div>
    );
  }

  if (!articles) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PanelFrame className="animate-fade-up">
        <PanelHeading number="05" title="Articles" />

        <div className="flex flex-col gap-6 px-6 py-10">
          {articles.map((article) => {
            const rowStatus = getStatus(article.id);
            return (
              <div key={article.id} className="border border-border p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <Field
                    label="Slug"
                    value={article.slug ?? ""}
                    onChange={(v) => updateArticleField(article.id, { slug: v || null })}
                  />
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">Source</span>
                    <select
                      value={article.source}
                      onChange={(e) =>
                        updateArticleField(article.id, { source: e.target.value as ArticleSource })
                      }
                      className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                    >
                      {SOURCES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Source label"
                    value={article.sourceLabel}
                    onChange={(v) => updateArticleField(article.id, { sourceLabel: v })}
                    className="w-32"
                  />
                  <Field
                    label="Published at"
                    type="date"
                    value={article.publishedAt}
                    onChange={(v) => updateArticleField(article.id, { publishedAt: v })}
                    className="w-40"
                  />
                  <Field
                    label="Order"
                    type="number"
                    value={String(article.order)}
                    onChange={(v) => updateArticleField(article.id, { order: Number(v) })}
                    className="w-20"
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Title (en)"
                    value={article.title.en}
                    onChange={(v) => updateArticleField(article.id, { title: { ...article.title, en: v } })}
                  />
                  <Field
                    label="Title (ja)"
                    value={article.title.ja}
                    onChange={(v) => updateArticleField(article.id, { title: { ...article.title, ja: v } })}
                  />
                  <Field
                    label="Summary (en)"
                    value={article.summary.en}
                    onChange={(v) =>
                      updateArticleField(article.id, { summary: { ...article.summary, en: v } })
                    }
                  />
                  <Field
                    label="Summary (ja)"
                    value={article.summary.ja}
                    onChange={(v) =>
                      updateArticleField(article.id, { summary: { ...article.summary, ja: v } })
                    }
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextareaField
                    label="Body (en)"
                    value={article.body?.en ?? ""}
                    onChange={(v) =>
                      updateArticleField(article.id, { body: { en: v, ja: article.body?.ja ?? "" } })
                    }
                  />
                  <TextareaField
                    label="Body (ja)"
                    value={article.body?.ja ?? ""}
                    onChange={(v) =>
                      updateArticleField(article.id, { body: { en: article.body?.en ?? "", ja: v } })
                    }
                  />
                </div>

                <Field
                  label="URL"
                  value={article.url}
                  onChange={(v) => updateArticleField(article.id, { url: v })}
                  className="mt-3"
                />

                <div className="mt-3 flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs text-fg-muted uppercase tracking-[0.1em]">
                    <input
                      type="checkbox"
                      checked={article.published}
                      onChange={(e) => updateArticleField(article.id, { published: e.target.checked })}
                    />
                    Published
                  </label>
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => handleSave(article)}
                    disabled={rowStatus.saving}
                    className="group inline-flex items-center gap-2 border border-fg bg-fg px-4 py-2 text-[11px] font-medium tracking-[0.12em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg disabled:opacity-50"
                  >
                    <span className="text-bg group-hover:text-fg-dim">›</span>
                    {rowStatus.saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(article)}
                    disabled={rowStatus.saving}
                    className="text-xs text-red-400 uppercase tracking-[0.1em] hover:text-red-300 disabled:opacity-50"
                  >
                    Delete
                  </button>
                  {rowStatus.saved && (
                    <span className="text-xs tracking-[0.1em] text-fg-muted uppercase">Saved</span>
                  )}
                  {rowStatus.error && <span className="text-xs text-red-400">{rowStatus.error}</span>}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addArticle}
            className="group inline-flex w-fit items-center gap-2 border border-border-strong px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase transition-colors hover:border-fg hover:text-fg"
          >
            <span className="text-fg-dim group-hover:text-current">›</span>
            Add article
          </button>
        </div>
      </PanelFrame>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  );
}
