"use client";

import Image from "next/image";
import type { Profile, Certification } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PanelFrame } from "@kyo8/ui";
import { PanelHeading } from "@kyo8/ui";
import TerminalPanel from "@/components/ui/TerminalPanel";

export default function AboutPreview({ profile, certifications }: { profile: Profile; certifications: Certification[] }) {
  const { locale, t } = useLocale();
  const paragraphs = profile.bio[locale].split("\n\n");

  return (
    <div id="about" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="01" title={t.about.title} />

        <div className="grid grid-cols-1 gap-8 p-6 sm:p-10 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-10">
          <div className="flex items-start gap-5 md:contents">
            <div className="shrink-0 border border-border p-2 sm:p-3 md:justify-self-start">
              <Image
                src="/makora.png"
                alt={profile.name}
                width={96}
                height={96}
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 [image-rendering:pixelated]"
              />
            </div>

            <div className="flex flex-col gap-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-fg-muted sm:text-base">
                  {paragraph}
                </p>
              ))}
              {certifications.length > 0 && (
                <section className="border-t border-border pt-4" aria-labelledby="certifications-title">
                  <h3 id="certifications-title" className="font-mono text-xs uppercase tracking-widest text-fg-muted">
                    {locale === "ja" ? "保有資格" : "Certifications"}
                  </h3>
                  <ul className="mt-2 space-y-3">
                    {certifications.map((certification) => (
                      <li key={certification.id}>
                        <p className="text-sm leading-relaxed sm:text-base">{certification.name[locale]}</p>
                        <p className="mt-1 text-xs text-fg-muted">
                          {certification.issuer} · {locale === "ja"
                            ? `${certification.acquiredDate.slice(0, 4)}年${Number(certification.acquiredDate.slice(5))}月取得`
                            : `Earned ${certification.acquiredDate}`}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          <TerminalPanel profile={profile} />
        </div>
      </PanelFrame>
    </div>
  );
}
