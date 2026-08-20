"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 text-[11px] tracking-[0.1em]" aria-label="Language">
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`cursor-pointer px-1 transition-colors ${
          locale === "en" ? "text-fg" : "text-fg-dim hover:text-fg-muted"
        }`}
      >
        EN
      </button>
      <span className="text-fg-dim">/</span>
      <button
        type="button"
        onClick={() => setLocale("ja")}
        aria-pressed={locale === "ja"}
        className={`cursor-pointer px-1 transition-colors ${
          locale === "ja" ? "text-fg" : "text-fg-dim hover:text-fg-muted"
        }`}
      >
        JA
      </button>
    </div>
  );
}
