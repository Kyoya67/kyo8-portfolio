import type { Metadata } from "next";
import SkillsContent from "@/components/skills/SkillsContent";
import { getSkillsOrFallback } from "@/lib/api/skills";

export const metadata: Metadata = {
  title: "Skills — KYO8",
  description: "Languages, frameworks, and infrastructure I work with.",
};

export default async function SkillsPage() {
  const skills = await getSkillsOrFallback();
  return <SkillsContent skills={skills} />;
}
