import type { Metadata } from "next";
import ArticlesContent from "@/components/articles/ArticlesContent";

export const metadata: Metadata = {
  title: "Articles — KYO8",
  description: "Posts from this site and external write-ups, in one place.",
};

export default function ArticlesPage() {
  return <ArticlesContent />;
}
