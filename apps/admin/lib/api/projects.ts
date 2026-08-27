import type { Project } from "@/types";
import { apiFetch } from "./client";

export async function listProjects(): Promise<Project[]> {
  const res = await apiFetch("/projects", undefined, { auth: false });
  return res.json();
}

export async function createProject(project: Project): Promise<void> {
  await apiFetch("/admin/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
}

export async function updateProject(project: Project): Promise<void> {
  await apiFetch(`/admin/projects/${encodeURIComponent(project.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await apiFetch(`/admin/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
}
