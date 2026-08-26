import type { Career } from "@/types";
import { careers as fallbackCareers } from "@/lib/data/careers";
import { apiFetch } from "./client";

export async function getCareers(): Promise<Career[]> {
  const res = await apiFetch("/careers", { cache: "no-store" });
  return res.json();
}

// Falls back to the static mock so public pages still render if the API is unreachable.
export async function getCareersOrFallback(): Promise<Career[]> {
  try {
    return await getCareers();
  } catch (err) {
    console.error("Failed to fetch careers from API, falling back to static data:", err);
    return fallbackCareers;
  }
}
