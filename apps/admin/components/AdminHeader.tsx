"use client"; 

import Link from "next/link";
import { ThemeToggle } from "@kyo8/ui";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminHeader() {
  const { status, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-bold text-fg">
          KYO8<span className="text-fg-dim">.</span>ADMIN
        </Link>
        <div className="flex items-center gap-3">
          {status === "authenticated" && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.1em] text-fg-muted uppercase transition-colors hover:text-fg"
            >
              <span className="text-fg-dim">›</span>
              Logout
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
