import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import SkillsGrid from "@/components/skills/SkillsGrid";
import { skills } from "@/lib/data/skills";

export const metadata: Metadata = {
  title: "Skills — KYO8",
  description: "Languages, frameworks, and infrastructure I work with.",
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Stack"
        title="Skills"
        description="Tools and technologies I reach for, grouped by where they sit in the stack."
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SkillsGrid skills={skills} />
      </section>
    </>
  );
}
