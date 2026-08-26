import type { Article } from "@/types";
import { articles as fallbackArticles } from "@/lib/data/articles";
import { apiFetch } from "./client";

export async function getArticles(): Promise<Article[]> {
  const res = await apiFetch("/articles", { cache: "no-store" });
  return res.json();
}

// Falls back to the static mock so public pages still render if the API is unreachable.
export async function getArticlesOrFallback(): Promise<Article[]> {
  try {
    return await getArticles();
  } catch (err) {
    console.error("Failed to fetch articles from API, falling back to static data:", err);
    return fallbackArticles;
  }
}
