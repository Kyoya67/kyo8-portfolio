"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Home() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-sm text-zinc-500">KYO8 Admin</p>
      <Link href="/profile" className="text-sm underline underline-offset-4">
        Profile
      </Link>
      <button
        type="button"
        onClick={logout}
        className="text-sm text-zinc-500 underline underline-offset-4"
      >
        Logout
      </button>
    </div>
  );
}
