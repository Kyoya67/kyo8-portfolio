"use client";

import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function TerminalPanel({ showStatus = false }: { showStatus?: boolean }) {
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
    <div className="border border-border bg-bg-inset/60 p-6 font-mono text-xs leading-7 sm:text-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
      </div>
      <p className="text-fg-muted">
        $ <span className="text-fg">{t.about.whoami}</span>
      </p>
      <div className="mt-1">
        {lines.map((line) => (
          <p key={line.key}>
            <span className="text-fg-dim">{line.key}:</span> <span className="text-fg">{line.value}</span>
          </p>
        ))}
      </div>
      <p className="mt-1 text-fg-muted">
        $ <span className="animate-blink text-fg">_</span>
      </p>
    </div>
  );
}
