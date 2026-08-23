import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesOrFallback } from "@/lib/api/articles";
import ArticleDetailContent from "@/components/articles/ArticleDetailContent";

async function getArticle(slug: string) {
  const articles = await getArticlesOrFallback();
  return articles.find((a) => a.slug === slug && a.source === "internal" && a.published);
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title.en} — KYO8`,
    description: article.summary.en,
  };
}

export default async function ArticleDetailPage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return <ArticleDetailContent article={article} />;
}
