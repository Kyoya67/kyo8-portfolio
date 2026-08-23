"use client";

import { PageHeader } from "@kyo8/ui";
import SkillsGrid from "@/components/skills/SkillsGrid";
import type { Skill } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function SkillsContent({ skills }: { skills: Skill[] }) {
  const { t } = useLocale();

  return (
    <>
      <PageHeader eyebrow={t.skills.eyebrow} title={t.skills.title} description={t.skills.pageDescription} />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SkillsGrid skills={skills} />
      </section>
    </>
  );
}
