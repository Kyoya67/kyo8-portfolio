"use client";

import Image from "next/image";
import type { Profile } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PanelFrame } from "@kyo8/ui";
import { PanelHeading } from "@kyo8/ui";
import TerminalPanel from "@/components/ui/TerminalPanel";

export default function AboutPreview({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const paragraphs = profile.bio[locale].split("\n\n");

  return (
    <div id="about" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="01" title={t.about.title} />

        <div className="grid grid-cols-1 gap-6 p-6 sm:p-10 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-10">
          <div className="order-1 shrink-0 border border-border p-2 sm:p-3">
            <Image
              src="/makora.png"
              alt={profile.name}
              width={96}
              height={96}
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 [image-rendering:pixelated]"
            />
          </div>

          <div className="order-2 md:order-3">
            <TerminalPanel profile={profile} />
          </div>

          <div className="order-3 flex flex-col gap-4 md:order-2">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-fg-muted sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </PanelFrame>
    </div>
  );
}
