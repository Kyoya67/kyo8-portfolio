import type { Metadata } from "next";
import ArticlesContent from "@/components/articles/ArticlesContent";
import { getArticlesOrFallback } from "@/lib/api/articles";

export const metadata: Metadata = {
  title: "Articles — KYO8",
  description: "Posts from this site and external write-ups, in one place.",
};

export default async function ArticlesPage() {
  const articles = await getArticlesOrFallback();
  return <ArticlesContent articles={articles} />;
}
