"use client";

import { MoonIcon, SunIcon } from "@kyo8/ui";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
      className="group relative flex h-9 w-9 shrink-0 items-center justify-center border border-border-strong text-fg-muted transition-colors hover:border-fg hover:text-fg cursor-pointer"
    >
      <SunIcon className="theme-icon-sun h-4 w-4" />
      <MoonIcon className="theme-icon-moon absolute h-4 w-4" />
    </button>
  );
}
