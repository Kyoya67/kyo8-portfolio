"use client";

import PageHeader from "@/components/ui/PageHeader";
import TerminalPanel from "@/components/ui/TerminalPanel";
import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AboutContent() {
  const { locale, t } = useLocale();
  const [p1, p2, p3] = t.about.paragraphs;

  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.title} description={t.about.pageDescription} />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-fg-muted sm:text-base">
            <p>{p1(profile.name, profile.headline[locale], profile.location[locale], profile.bio[locale])}</p>
            <p>{p2}</p>
            <p>{p3}</p>

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
