"use client";

import { useState } from "react";
import type { Skill, SkillCategory, SkillChild } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { CloudIcon, CodeIcon, DatabaseIcon, LinkIcon, LockIcon, ServerIcon } from "@kyo8/ui";

const CATEGORY_ORDER: SkillCategory[] = [
  "frontend",
  "backend",
  "infrastructure",
  "database",
  "authentication",
  "blockchain",
];

const CATEGORY_ICONS: Record<SkillCategory, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  frontend: CodeIcon,
  backend: ServerIcon,
  infrastructure: CloudIcon,
  database: DatabaseIcon,
  authentication: LockIcon,
  blockchain: LinkIcon,
};

function CapabilityTags({ capabilities }: { capabilities: string[] }) {
  if (capabilities.length === 0) return null;
  return (
    <div className="mt-1.5 ml-3.5 flex flex-wrap gap-1.5">
      {capabilities.map((capability) => (
        <span key={capability} className="border border-border px-1.5 py-0.5 text-[10px] text-fg-dim">
          {capability}
        </span>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  capabilities,
  open,
  onToggle,
  className,
  bullet,
}: {
  label: string;
  capabilities: string[];
  open: boolean;
  onToggle: () => void;
  className: string;
  bullet?: string;
}) {
  if (capabilities.length === 0) {
    return (
      <p className={bullet ? `flex items-center gap-2 ${className}` : className}>
        {bullet && <span className="text-fg-dim">{bullet}</span>}
        {label}
      </p>
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-2 text-left transition-colors hover:text-fg cursor-pointer ${className}`}
      >
        <span className={`text-fg-dim transition-transform ${open ? "rotate-90" : ""}`}>›</span>
        {label}
      </button>
      {open && <CapabilityTags capabilities={capabilities} />}
    </>
  );
}

export default function SkillsGrid({ skills }: { skills: Skill[] }) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category).sort((a, b) => a.order - b.order),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
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
                  <ToggleRow
                    label={skill.name}
                    capabilities={skill.capabilities}
                    open={expanded.has(skill.id)}
                    onToggle={() => toggle(skill.id)}
                    className="text-sm text-fg-muted"
                    bullet="•"
                  />
                  {skill.children.length > 0 && (
                    <ul className="mt-1.5 ml-3.5 flex flex-col gap-1.5 border-l border-border pl-3">
                      {skill.children.map((child: SkillChild) => (
                        <li key={child.id}>
                          <ToggleRow
                            label={child.name}
                            capabilities={child.capabilities}
                            open={expanded.has(child.id)}
                            onToggle={() => toggle(child.id)}
                            className="text-xs text-fg-dim"
                          />
                        </li>
                      ))}
                    </ul>
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
