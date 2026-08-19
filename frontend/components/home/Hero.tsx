"use client";

import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Hero() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="relative mx-auto max-w-4xl px-6 py-24 md:py-32">
        <h1 className="text-glow animate-fade-up max-w-3xl text-4xl leading-[1.15] font-bold tracking-[0.04em] whitespace-pre-line uppercase sm:text-5xl md:text-6xl">
          {profile.headline[locale]}
        </h1>

        <span className="mt-8 block text-2xl text-fg-dim">—</span>

        <p className="mt-6 text-xs tracking-[0.2em] text-fg-muted uppercase">
          {profile.location[locale]} <span className="text-fg-dim">·</span> {year}
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-14 w-14 items-center justify-center rounded-md border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
          >
            <GitHubIcon className="h-5 w-5" />
          </Link>
          {profile.linkedinUrl && (
            <Link
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-14 w-14 items-center justify-center rounded-md border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
            >
              <LinkedInIcon className="h-5 w-5" />
            </Link>
          )}
          {profile.email && (
            <Link
              href={profile.email}
              aria-label="Email"
              className="flex h-14 w-14 items-center justify-center rounded-md border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
            >
              <MailIcon className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
