"use client";

import type { Profile } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PanelFrame } from "@kyo8/ui";
import { GitHubIcon, LinkedInIcon, XIcon } from "@kyo8/ui";
import HexTicker from "./HexTicker";

export default function Hero({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10"><PanelFrame>
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_90%_70%_at_40%_30%,black,transparent)]" />

        <div className="relative grid grid-cols-1 items-center gap-10 px-6 py-14 sm:px-10 sm:py-20 md:grid-cols-2">
          <div className="animate-fade-up">
            <h1 className="text-glow text-4xl leading-none font-bold tracking-tight sm:text-5xl">
              {profile.handle}
              <span className="animate-blink text-fg-dim">_</span>
            </h1>

            <p className="mt-5 text-xs tracking-[0.15em] text-fg-muted uppercase sm:text-sm">
              {profile.headline[locale]}
            </p>
            <p className="mt-1 text-xs text-fg-dim sm:text-sm">{t.hero.basedIn(profile.location[locale])}</p>

            <div className="mt-8">
              
        <div className="flex items-center gap-6">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
          {profile.xUrl && (
            <a
              href={profile.xUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
            >

              <XIcon className="h-3.5 w-3.5" />
              (Twitter)
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
            >

              <LinkedInIcon className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          )}
        </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 md:justify-end">
            <HexTicker />
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-border px-6 py-3 text-[10px] tracking-[0.15em] text-fg-dim uppercase sm:px-10">
          <span>KERNEL v0.8.0</span>
        </div>
      </PanelFrame>
    </div>
  );
}
