"use client";

import type { Profile } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Footer({ profile }: { profile: Profile }) {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pt-8 pb-10 sm:px-6">
      <div className="mt-6 flex flex-col items-center border-t border-border pt-6 text-xs text-fg-dim">
        <p>
          › © {year} {profile.handle}_
        </p>
      </div>
    </footer>
  );
}
