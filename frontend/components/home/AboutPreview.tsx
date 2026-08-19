"use client";

import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import PanelFrame from "@/components/ui/PanelFrame";
import PanelHeading from "@/components/ui/PanelHeading";
import BracketButton from "@/components/ui/BracketButton";
import PixelArt from "@/components/ui/PixelArt";
import TerminalPanel from "@/components/ui/TerminalPanel";
import { PIXEL_AVATAR } from "@/lib/pixel-art";

export default function AboutPreview() {
  const { locale, t } = useLocale();
  const [firstParagraph] = profile.bio[locale].split("\n\n");

  return (
    <div id="about" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="01" title={t.about.title} />

        <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 md:grid-cols-[auto_1fr_1fr] md:items-start">
          <div className="flex justify-center border border-border p-3 text-fg md:justify-self-start">
            <PixelArt pattern={PIXEL_AVATAR} cell={4} />
          </div>

          <div>
            <p className="text-sm leading-relaxed text-fg-muted sm:text-base">{firstParagraph}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BracketButton href="/about">{t.about.moreLink}</BracketButton>
              <BracketButton href="/resume.pdf" external>
                {t.about.resumeLink}
              </BracketButton>
            </div>
          </div>

          <TerminalPanel />
        </div>
      </PanelFrame>
    </div>
  );
}
