import type { Career } from "@/types";
import { apiFetch } from "./client";

export async function listCareers(): Promise<Career[]> {
  const res = await apiFetch("/careers", undefined, { auth: false });
  return res.json();
}

export async function createCareer(career: Career): Promise<void> {
  await apiFetch("/admin/careers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(career),
  });
}

export async function updateCareer(career: Career): Promise<void> {
  await apiFetch(`/admin/careers/${encodeURIComponent(career.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(career),
  });
}

export async function deleteCareer(id: string): Promise<void> {
  await apiFetch(`/admin/careers/${encodeURIComponent(id)}`, { method: "DELETE" });
}
