import type { Project } from "@/types";
import { projects as fallbackProjects } from "@/lib/data/projects";
import { apiFetch } from "./client";

export async function getProjects(): Promise<Project[]> {
  const res = await apiFetch("/projects", { cache: "no-store" });
  return res.json();
}

// Falls back to the static mock so public pages still render if the API is unreachable.
export async function getProjectsOrFallback(): Promise<Project[]> {
  try {
    return await getProjects();
  } catch (err) {
    console.error("Failed to fetch projects from API, falling back to static data:", err);
    return fallbackProjects;
  }
}
