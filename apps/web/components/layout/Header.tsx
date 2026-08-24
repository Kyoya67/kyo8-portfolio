"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@kyo8/ui";
import LocaleToggle from "./LocaleToggle";

const SECTION_IDS = ["about", "skills", "projects", "articles", "career"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "articles", label: "Articles" },
  { id: "career", label: "Career" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
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
    if (!isHome) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    router.replace(`/#${id}`, { scroll: false });
  }

  const effectiveActiveId = isHome ? activeId : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-bold text-fg">
          KYO8.dev
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = effectiveActiveId === item.id;
            return (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`inline-flex items-center gap-1 text-xs tracking-[0.1em] uppercase transition-colors hover:text-fg ${
                  active ? "text-fg" : "text-fg-muted"
                }`}
              >
                <span className="text-fg-dim">›</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
