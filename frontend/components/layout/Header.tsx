"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "./LocaleToggle";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const SECTION_IDS = ["about", "skills", "projects", "career"] as const;
type SectionId = (typeof SECTION_IDS)[number];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [isHome]);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) {
    setOpen(false);
    if (!isHome) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    router.replace(`/#${id}`, { scroll: false });
  }

  const NAV_ITEMS: { id: SectionId; label: string }[] = [
    { id: "about", label: t.nav.about },
    { id: "skills", label: t.nav.skills },
    { id: "projects", label: t.nav.projects },
    { id: "career", label: t.nav.career },
  ];

  const effectiveActiveId = isHome ? activeId : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-bold tracking-[0.2em] text-fg" onClick={() => setOpen(false)}>
          KYO8
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = effectiveActiveId === item.id;
            return (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-xs tracking-[0.15em] uppercase transition-colors hover:text-fg ${
                  active ? "text-fg" : "text-fg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 md:flex">
            <LocaleToggle />
            <ThemeToggle />
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden cursor-pointer"
          >
            <span className={`h-px w-5 bg-fg transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-fg transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-xs tracking-[0.15em] uppercase ${
                  effectiveActiveId === item.id ? "text-fg" : "text-fg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-5 pt-2">
              <LocaleToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
