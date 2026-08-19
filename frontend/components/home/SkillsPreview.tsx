"use client";

import { skills } from "@/lib/data/skills";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import PanelFrame from "@/components/ui/PanelFrame";
import PanelHeading from "@/components/ui/PanelHeading";
import SkillsGrid from "@/components/skills/SkillsGrid";

export default function SkillsPreview() {
  const { t } = useLocale();

  return (
    <div id="skills" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="02" title={t.skills.title} action={{ href: "/skills", label: t.skills.allLink }} />
        <div className="p-6 sm:p-10">
          <SkillsGrid skills={skills} />
        </div>
      </PanelFrame>
    </div>
  );
}
