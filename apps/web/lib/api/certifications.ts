import type { Certification } from "@/types";
import { apiFetch } from "./client";

export async function getCertifications(): Promise<Certification[]> {
  const res = await apiFetch("/certifications", { cache: "no-store" });
  return res.json();
}

export async function getCertificationsOrEmpty(): Promise<Certification[]> {
  try {
    return await getCertifications();
  } catch (err) {
    console.error("Failed to fetch certifications from API:", err);
    return [];
  }
}
