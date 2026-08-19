"use client";

import type { Skill, SkillCategory } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const CATEGORY_ORDER: SkillCategory[] = [
  "languages",
  "backend",
  "infrastructure",
  "database",
  "blockchain",
  "tools",
];

export default function SkillsGrid({ skills }: { skills: Skill[] }) {
  const { t } = useLocale();

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category).sort((a, b) => a.order - b.order),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
      {grouped.map((group) => (
        <div key={group.category}>
          <p className="mb-5 text-[11px] tracking-[0.2em] text-fg-dim uppercase">
            {t.skills.categories[group.category]}
          </p>
          <ul className="flex flex-col gap-3">
            {group.items.map((skill) => (
              <li key={skill.id} className="text-sm text-fg-muted transition-colors hover:text-fg">
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
