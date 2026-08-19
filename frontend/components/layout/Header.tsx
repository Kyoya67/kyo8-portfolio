"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/career", label: "Career" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.2em] text-fg"
          onClick={() => setOpen(false)}
        >
          KYO8
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
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
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden cursor-pointer"
          >
            <span
              className={`h-px w-5 bg-fg transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-fg transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-xs tracking-[0.15em] uppercase text-fg-muted hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
