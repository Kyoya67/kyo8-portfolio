import type { Skill } from "@/types";
import { apiFetch } from "./client";

export async function getSkills(): Promise<Skill[]> {
  // Public endpoint — no Authorization header, so no CORS preflight is triggered.
  const res = await apiFetch("/skills", undefined, { auth: false });
  return res.json();
}

export async function updateSkills(skills: Skill[]): Promise<void> {
  await apiFetch("/admin/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(skills),
  });
}
