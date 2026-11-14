import type { Certification } from "@/types";
import { apiFetch } from "./client";

export async function listCertifications(): Promise<Certification[]> {
  const res = await apiFetch("/certifications", undefined, { auth: false });
  return res.json();
}

export async function createCertification(certification: Certification): Promise<void> {
  await apiFetch("/admin/certifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(certification),
  });
}

export async function updateCertification(certification: Certification): Promise<void> {
  await apiFetch(`/admin/certifications/${encodeURIComponent(certification.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(certification),
  });
}

export async function deleteCertification(id: string): Promise<void> {
  await apiFetch(`/admin/certifications/${encodeURIComponent(id)}`, { method: "DELETE" });
}
