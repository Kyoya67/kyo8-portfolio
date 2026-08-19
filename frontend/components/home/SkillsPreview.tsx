"use client";

import { skills } from "@/lib/data/skills";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillsGrid from "@/components/skills/SkillsGrid";

export default function SkillsPreview() {
  const { t } = useLocale();

  return (
    <section id="skills" className="scroll-anchor border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
          action={{ href: "/skills", label: t.skills.allLink }}
        />
        <SkillsGrid skills={skills} />
      </div>
    </section>
  );
}
