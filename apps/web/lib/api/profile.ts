import type { Profile } from "@/types";
import { profile as fallbackProfile } from "@/lib/data/profile";
import { apiFetch } from "./client";

export async function getProfile(): Promise<Profile> {
  const res = await apiFetch("/profile", { cache: "no-store" });
  return res.json();
}

// Falls back to the static mock so public pages still render if the API is unreachable.
export async function getProfileOrFallback(): Promise<Profile> {
  try {
    return await getProfile();
  } catch (err) {
    console.error("Failed to fetch profile from API, falling back to static data:", err);
    return fallbackProfile;
  }
}
