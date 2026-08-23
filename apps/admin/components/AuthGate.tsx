"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const PUBLIC_PATHS = new Set(["/login", "/callback"]);

export default function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = PUBLIC_PATHS.has(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && !isPublicPath) {
      router.replace("/login");
    }
  }, [status, isPublicPath, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
          Loading<span className="animate-blink">_</span>
        </p>
      </div>
    );
  }

  if (status === "unauthenticated" && !isPublicPath) {
    return null;
  }

  return <>{children}</>;
}
