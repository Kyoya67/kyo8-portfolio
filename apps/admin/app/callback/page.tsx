"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PanelFrame, PanelHeading } from "@kyo8/ui";
import { useAuth } from "@/lib/auth/AuthContext";

function CallbackInner() {
  const { handleCallback, status, error } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const oauthError = searchParams.get("error");
    if (oauthError) {
      handled.current = true;
      router.replace("/login");
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (code && state) {
      handled.current = true;
      handleCallback(code, state);
    }
  }, [searchParams, handleCallback, router]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="mx-auto flex max-w-md flex-1 items-center px-4 py-16 sm:px-6">
      <PanelFrame className="w-full animate-fade-up">
        <PanelHeading number="01" title="Admin Login" />
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
            Signing in<span className="animate-blink">_</span>
          </p>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </PanelFrame>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-6 py-24">
          <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
            Signing in<span className="animate-blink">_</span>
          </p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
