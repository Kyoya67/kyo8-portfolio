import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/lib/data/articles";
import ArticleDetailContent from "@/components/articles/ArticleDetailContent";

export function generateStaticParams() {
  return articles
    .filter((a) => a.published && a.source === "internal" && a.slug)
    .map((a) => ({ slug: a.slug as string }));
}

function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug && a.source === "internal" && a.published);
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title.en} — KYO8`,
    description: article.summary.en,
  };
}

export default async function ArticleDetailPage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  return <ArticleDetailContent article={article} />;
}
