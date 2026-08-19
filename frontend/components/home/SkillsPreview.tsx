import { skills } from "@/lib/data/skills";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillsGrid from "@/components/skills/SkillsGrid";

export default function SkillsPreview() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading eyebrow="Stack" title="Skills" action={{ href: "/skills", label: "All skills" }} />
        <SkillsGrid skills={skills} />
      </div>
    </section>
  );
}
