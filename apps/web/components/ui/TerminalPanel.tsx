"use client";

import type { Profile } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import PanelFrame from "./PanelFrame";

export default function TerminalPanel({ profile, showStatus = false }: { profile: Profile; showStatus?: boolean }) {
  const { locale, t } = useLocale();

  const lines: { key: string; value: string }[] = [
    { key: t.about.nameLabel, value: profile.name.toUpperCase() },
    { key: t.about.roleLabel, value: profile.headline[locale] },
    { key: t.about.locationLabel, value: profile.location[locale] },
    { key: t.about.focusLabel, value: profile.focus.join(", ") },
  ];
  if (showStatus) {
    lines.push({ key: t.about.statusLabel, value: t.about.statusValue });
  }

  return (
    <PanelFrame className="h-full bg-bg-inset/40 p-6 font-mono text-xs leading-7 sm:text-sm">
      <p className="mb-2 text-fg-dim">
        {"// "}
        {t.about.infoLabel}
      </p>
      <div>
        {lines.map((line) => (
          <p key={line.key}>
            <span className="text-fg-dim">{line.key}:</span> <span className="text-fg">{line.value}</span>
          </p>
        ))}
      </div>
      <p className="mt-2 text-fg-muted">
        <span className="text-fg-dim">{">"}</span>
        <span className="animate-blink text-fg">_</span>
      </p>
    </PanelFrame>
  );
}
