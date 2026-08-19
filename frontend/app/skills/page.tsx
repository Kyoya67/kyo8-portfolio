import type { Metadata } from "next";
import SkillsContent from "@/components/skills/SkillsContent";

export const metadata: Metadata = {
  title: "Skills — KYO8",
  description: "Languages, frameworks, and infrastructure I work with.",
};

export default function SkillsPage() {
  return <SkillsContent />;
}
