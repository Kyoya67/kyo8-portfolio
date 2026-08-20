"use client";

import PageHeader from "@/components/ui/PageHeader";
import SkillsGrid from "@/components/skills/SkillsGrid";
import { skills } from "@/lib/data/skills";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function SkillsContent() {
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
