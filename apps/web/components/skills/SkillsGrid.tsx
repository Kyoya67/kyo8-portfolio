"use client";

import { useState } from "react";
import type { Skill, SkillCategory } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { CloudIcon, CodeIcon, DatabaseIcon, LinkIcon, ServerIcon } from "@kyo8/ui";
import Modal from "@/components/ui/Modal";

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
  const [selected, setSelected] = useState<Skill | null>(null);

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category).sort((a, b) => a.order - b.order),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {grouped.map((group) => {
          const Icon = CATEGORY_ICONS[group.category];
          return (
            <div key={group.category}>
              <p className="mb-4 flex items-center gap-2 text-[11px] tracking-[0.15em] text-fg-dim uppercase">
                <Icon className="h-3.5 w-3.5" />
                {t.skills.categories[group.category]}
              </p>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((skill) => {
                  const hasKeywords = skill.keywords.length > 0;
                  return (
                    <li key={skill.id}>
                      <button
                        type="button"
                        disabled={!hasKeywords}
                        onClick={() => setSelected(skill)}
                        className={`flex w-full items-center gap-2 text-left text-sm text-fg-muted transition-colors ${
                          hasKeywords ? "cursor-pointer hover:text-fg" : "cursor-default"
                        }`}
                      >
                        <span className="text-fg-dim">•</span>
                        {skill.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        <div className="flex flex-wrap gap-2">
          {selected?.keywords.map((keyword) => (
            <span
              key={keyword}
              className="border border-border-strong px-2.5 py-1 text-xs text-fg-muted uppercase tracking-[0.05em]"
            >
              {keyword}
            </span>
          ))}
        </div>
      </Modal>
    </>
  );
}
