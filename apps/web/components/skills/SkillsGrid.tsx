"use client";

import type { Skill, SkillCategory } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { CloudIcon, CodeIcon, DatabaseIcon, LinkIcon, ServerIcon } from "@kyo8/ui";

const CATEGORY_ORDER: SkillCategory[] = [
  "frontend",
  "backend",
  "infrastructure",
  "database",
  "blockchain",
];

const CATEGORY_ICONS: Record<SkillCategory, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  frontend: CodeIcon,
  backend: ServerIcon,
  infrastructure: CloudIcon,
  database: DatabaseIcon,
  blockchain: LinkIcon,
};

export default function SkillsGrid({ skills }: { skills: Skill[] }) {
  const { t } = useLocale();

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category).sort((a, b) => a.order - b.order),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
      {grouped.map((group) => {
        const Icon = CATEGORY_ICONS[group.category];
        return (
          <div key={group.category}>
            <p className="mb-4 flex items-center gap-2 text-[11px] tracking-[0.15em] text-fg-dim uppercase">
              <Icon className="h-3.5 w-3.5" />
              {t.skills.categories[group.category]}
            </p>
            <ul className="flex flex-col gap-3">
              {group.items.map((skill) => (
                <li key={skill.id}>
                  <p className="flex items-center gap-2 text-sm text-fg-muted">
                    <span className="text-fg-dim">•</span>
                    {skill.name}
                  </p>
                  {skill.keywords.length > 0 && (
                    <div className="mt-1.5 ml-3.5 flex flex-wrap gap-1.5">
                      {skill.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="border border-border px-1.5 py-0.5 text-[10px] text-fg-dim"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
