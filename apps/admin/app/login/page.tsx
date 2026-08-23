"use client";

import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const { login, error } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-sm text-zinc-500">KYO8 Admin</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={login}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Login with Cognito
      </button>
    </div>
  );
}
