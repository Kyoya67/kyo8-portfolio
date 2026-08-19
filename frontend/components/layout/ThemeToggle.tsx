"use client";

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
      className="group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border-strong bg-bg-inset transition-colors cursor-pointer"
    >
      <span className="theme-knob inline-block h-4 w-4 rounded-full bg-fg transition-transform duration-200 ease-out" />
    </button>
  );
}
