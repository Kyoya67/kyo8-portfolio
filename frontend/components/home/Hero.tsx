"use client";

import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import CubeVisual from "./CubeVisual";

export default function Hero() {
  const { locale, t } = useLocale();

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_20%,black,transparent)]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="animate-fade-up">
          <p className="mb-6 flex items-center gap-2 text-xs tracking-[0.3em] text-fg-muted uppercase">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-fg" />
            {profile.headline[locale]}
          </p>

          <h1 className="text-glow text-4xl leading-[1.12] font-bold tracking-tight uppercase sm:text-5xl lg:text-6xl">
            {t.hero.heading1}
            <br />
            {t.hero.heading2}
            <span className="animate-blink text-fg-dim">_</span>
          </h1>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-fg-muted">{profile.bio[locale]}</p>

          <div className="mt-10 flex items-center gap-5">
            <Link
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
            >
              <GitHubIcon className="h-4 w-4" />
            </Link>
            {profile.linkedinUrl && (
              <Link
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
              >
                <LinkedInIcon className="h-4 w-4" />
              </Link>
            )}
            {profile.email && (
              <Link
                href={profile.email}
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
              >
                <MailIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <CubeVisual />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-6 hidden flex-col items-center gap-3 md:flex">
        <span className="text-[10px] tracking-[0.3em] text-fg-dim [writing-mode:vertical-rl]">
          {profile.focus.join(" / ")}
        </span>
        <span className="h-16 w-px bg-border-strong" />
      </div>
    </section>
  );
}
