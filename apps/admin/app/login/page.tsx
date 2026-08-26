"use client";

import { PanelFrame, PanelHeading } from "@kyo8/ui";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const { login, error } = useAuth();

  return (
    <div className="mx-auto flex max-w-md flex-1 items-center px-4 py-16 sm:px-6">
      <PanelFrame className="w-full animate-fade-up">
        <PanelHeading number="01" title="Admin Login" />
        <div className="flex flex-col items-center gap-6 px-6 py-14 text-center">
          <p className="text-xs tracking-[0.1em] text-fg-muted uppercase">
            Sign in with Cognito to manage kyo8.dev
          </p>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="button"
            onClick={login}
            className="group inline-flex items-center gap-2 border border-fg bg-fg px-5 py-3 text-[11px] font-medium tracking-[0.12em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg"
          >
            <span className="text-bg group-hover:text-fg-dim">›</span>
            Login with Cognito
          </button>
        </div>
      </PanelFrame>
    </div>
  );
}
