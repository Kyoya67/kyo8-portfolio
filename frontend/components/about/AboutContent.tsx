"use client";

import PageHeader from "@/components/ui/PageHeader";
import TerminalPanel from "@/components/ui/TerminalPanel";
import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AboutContent() {
  const { locale, t } = useLocale();
  const bioParagraphs = profile.bio[locale].split("\n\n");

  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.title} description={t.about.pageDescription} />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-fg-muted sm:text-base">
            <p className="text-base text-fg sm:text-lg">
              {t.about.basedIn(profile.headline[locale], profile.location[locale])}
            </p>
            {bioParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="mt-4 flex flex-wrap gap-3">
              {profile.focus.map((item) => (
                <span
                  key={item}
                  className="border border-border px-3 py-1.5 text-xs tracking-wide text-fg-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <TerminalPanel showStatus />
        </div>
      </section>
    </>
  );
}
