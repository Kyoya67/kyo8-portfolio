import type { Project } from "@/types";
import { apiFetch, ApiError } from "./client";

export interface ProjectImageUploadRequest {
  contentType: string;
  extension: string;
}

export interface ProjectImageUploadResponse {
  uploadUrl: string;
  imageUrl: string;
  imageKey: string;
}

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

/** Requests a presigned S3 URL for uploading a project's image. */
export async function createProjectImageUpload(
  id: string,
  input: ProjectImageUploadRequest
): Promise<ProjectImageUploadResponse> {
  const res = await apiFetch(`/admin/projects/${encodeURIComponent(id)}/image-upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

/** Uploads a file directly to S3 via a presigned PUT URL. No auth header, no API base URL. */
export async function uploadProjectImageFile(uploadUrl: string, file: File): Promise<void> {
  let res: Response;
  try {
    res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
  } catch {
    throw new ApiError(`Could not reach the upload URL for ${file.name}.`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(
      `Image upload failed with status ${res.status}${body ? `: ${body}` : ""}`,
      res.status
    );
  }
}
