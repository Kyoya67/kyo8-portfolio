import type { Article } from "@/types";
import { apiFetch } from "./client";

export async function listArticles(): Promise<Article[]> {
  const res = await apiFetch("/admin/articles");
  return res.json();
}

export async function createArticle(article: Article): Promise<void> {
  await apiFetch("/admin/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });
}

export async function updateArticle(article: Article): Promise<void> {
  await apiFetch(`/admin/articles/${encodeURIComponent(article.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });
}

export async function deleteArticle(id: string): Promise<void> {
  await apiFetch(`/admin/articles/${encodeURIComponent(id)}`, { method: "DELETE" });
}
