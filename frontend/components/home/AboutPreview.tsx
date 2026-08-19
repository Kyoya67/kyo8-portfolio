"use client";

import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import TerminalPanel from "@/components/ui/TerminalPanel";

export default function AboutPreview() {
  const { locale, t } = useLocale();
  const [firstParagraph] = profile.bio[locale].split("\n\n");

  return (
    <section id="about" className="scroll-anchor border-b border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-24 md:grid-cols-2 md:gap-20">
        <div>
          <h2 className="mb-6 text-sm font-bold tracking-[0.2em] uppercase">
            {t.about.title}
            <span className="mt-2 block h-px w-8 bg-fg" />
          </h2>
          <p className="text-lg leading-relaxed text-fg sm:text-xl">
            {t.about.basedIn(profile.headline[locale], profile.location[locale])}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted sm:text-base">{firstParagraph}</p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/about"
              className="inline-flex w-fit items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <span className="text-fg-dim">{">"}</span> {t.about.moreLink}
            </Link>
          </div>
        </div>

        <TerminalPanel />
      </div>
    </section>
  );
}
