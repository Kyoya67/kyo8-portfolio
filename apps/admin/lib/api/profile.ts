import type { Profile } from "@/types";
import { apiFetch } from "./client";

export async function getProfile(): Promise<Profile> {
  // Public endpoint — no Authorization header, so no CORS preflight is triggered.
  const res = await apiFetch("/profile", undefined, { auth: false });
  return res.json();
}

export async function updateProfile(profile: Profile): Promise<void> {
  await apiFetch("/admin/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
}
