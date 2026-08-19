"use client";

import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import PanelFrame from "@/components/ui/PanelFrame";
import BracketButton from "@/components/ui/BracketButton";
import PixelArt from "@/components/ui/PixelArt";
import { GitHubIcon, LinkedInIcon, MailIcon, XIcon } from "@/components/icons";
import { PIXEL_TERMINAL } from "@/lib/pixel-art";

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  const [line1, line2, line3] = t.cta.title;

  return (
    <footer className="px-4 pt-8 pb-10 sm:px-6">
      <div className="mt-6 flex flex-col items-center gap-4 border-t border-border pt-6 text-xs text-fg-dim sm:flex-row sm:justify-between">
        <p>
          › © {year} {profile.handle}_
        </p>
        <div className="flex items-center gap-6">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
          >
            <span className="text-fg-dim">›</span>
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
              <span className="text-fg-dim">›</span>
              <XIcon className="h-3.5 w-3.5" />
              X (Twitter)
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              <span className="text-fg-dim">›</span>
              <LinkedInIcon className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
