import type { Profile } from "@/types";
import { apiFetch } from "./client";

export async function getProfile(): Promise<Profile> {
  const res = await apiFetch("/profile");
  return res.json();
}

export async function updateProfile(profile: Profile): Promise<void> {
  await apiFetch("/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
}
