"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-sm text-zinc-500">Signing in…</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-zinc-500">Signing in…</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
