"use client";

import type { Skill } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PanelFrame } from "@kyo8/ui";
import { PanelHeading } from "@kyo8/ui";
import SkillsGrid from "@/components/skills/SkillsGrid";

export default function SkillsPreview({ skills }: { skills: Skill[] }) {
  const { t } = useLocale();

  return (
    <div id="skills" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="02" title={t.skills.title} />
        <div className="p-6 sm:p-10">
          <SkillsGrid skills={skills} />
        </div>
      </PanelFrame>
    </div>
  );
}
