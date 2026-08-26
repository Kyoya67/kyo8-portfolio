import type { Skill } from "@/types";
import { skills as fallbackSkills } from "@/lib/data/skills";
import { apiFetch } from "./client";

export async function getSkills(): Promise<Skill[]> {
  const res = await apiFetch("/skills", { cache: "no-store" });
  return res.json();
}

// Falls back to the static mock so public pages still render if the API is unreachable.
export async function getSkillsOrFallback(): Promise<Skill[]> {
  try {
    return await getSkills();
  } catch (err) {
    console.error("Failed to fetch skills from API, falling back to static data:", err);
    return fallbackSkills;
  }
}
