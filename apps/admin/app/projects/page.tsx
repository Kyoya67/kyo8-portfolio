"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/types";
import { createProject, deleteProject, listProjects, updateProject } from "@/lib/api/projects";
import { PanelFrame, PanelHeading } from "@kyo8/ui";

const GRAPHICS: Project["graphic"][] = ["analytics", "network", "terminal", "chain", "grid", "stream"];

function newId(): string {
  return `p-${Math.random().toString(36).slice(2, 10)}`;
}

function newProject(): Project {
  return {
    id: newId(),
    slug: "",
    title: { en: "", ja: "" },
    summary: { en: "", ja: "" },
    description: { en: "", ja: "" },
    graphic: "grid",
    repositoryUrl: "",
    websiteUrl: null,
    technologies: [],
    featured: false,
    published: false,
    order: 1,
    year: "",
  };
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

interface RowStatus {
  saving: boolean;
  error: string | null;
  saved: boolean;
}

const IDLE_STATUS: RowStatus = { saving: false, error: null, saved: false };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, RowStatus>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listProjects();
      setProjects(data);
      setNewIds(new Set());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount; `load` also drives the retry button.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function getStatus(id: string): RowStatus {
    return status[id] ?? IDLE_STATUS;
  }

  function setRowStatus(id: string, patch: Partial<RowStatus>) {
    setStatus((prev) => ({ ...prev, [id]: { ...IDLE_STATUS, ...prev[id], ...patch } }));
  }

  function updateProjectField(id: string, patch: Partial<Project>) {
    setProjects((prev) => prev?.map((p) => (p.id === id ? { ...p, ...patch } : p)) ?? prev);
    setRowStatus(id, { saved: false });
  }

  function addProject() {
    const project = newProject();
    setProjects((prev) => [...(prev ?? []), project]);
    setNewIds((prev) => new Set(prev).add(project.id));
  }

  async function handleSave(project: Project) {
    setRowStatus(project.id, { saving: true, error: null, saved: false });
    try {
      if (newIds.has(project.id)) {
        await createProject(project);
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(project.id);
          return next;
        });
      } else {
        await updateProject(project);
      }
      setRowStatus(project.id, { saving: false, saved: true });
    } catch (err) {
      setRowStatus(project.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to save project",
      });
    }
  }

  async function handleDelete(project: Project) {
    if (newIds.has(project.id)) {
      setProjects((prev) => prev?.filter((p) => p.id !== project.id) ?? prev);
      return;
    }
    setRowStatus(project.id, { saving: true, error: null });
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev?.filter((p) => p.id !== project.id) ?? prev);
    } catch (err) {
      setRowStatus(project.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to delete project",
      });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="04" title="Projects" />
          <div className="px-6 py-14 text-center">
            <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
              Loading projects<span className="animate-blink">_</span>
            </p>
          </div>
        </PanelFrame>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="04" title="Projects" />
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <p className="text-xs text-red-400">{loadError}</p>
            <button
              type="button"
              onClick={load}
              className="group inline-flex items-center gap-2 border border-border-strong px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase transition-colors hover:border-fg hover:text-fg"
            >
              <span className="text-fg-dim group-hover:text-current">›</span>
              Retry
            </button>
          </div>
        </PanelFrame>
      </div>
    );
  }

  if (!projects) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PanelFrame className="animate-fade-up">
        <PanelHeading number="04" title="Projects" />

        <div className="flex flex-col gap-6 px-6 py-10">
          {projects.map((project) => {
            const rowStatus = getStatus(project.id);
            return (
              <div key={project.id} className="border border-border p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <Field
                    label="Slug"
                    value={project.slug}
                    onChange={(v) => updateProjectField(project.id, { slug: v })}
                  />
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">Graphic</span>
                    <select
                      value={project.graphic}
                      onChange={(e) =>
                        updateProjectField(project.id, { graphic: e.target.value as Project["graphic"] })
                      }
                      className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                    >
                      {GRAPHICS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Order"
                    type="number"
                    value={String(project.order)}
                    onChange={(v) => updateProjectField(project.id, { order: Number(v) })}
                    className="w-20"
                  />
                  <Field
                    label="Year"
                    value={project.year}
                    onChange={(v) => updateProjectField(project.id, { year: v })}
                    className="w-24"
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Title (en)"
                    value={project.title.en}
                    onChange={(v) => updateProjectField(project.id, { title: { ...project.title, en: v } })}
                  />
                  <Field
                    label="Title (ja)"
                    value={project.title.ja}
                    onChange={(v) => updateProjectField(project.id, { title: { ...project.title, ja: v } })}
                  />
                  <Field
                    label="Summary (en)"
                    value={project.summary.en}
                    onChange={(v) => updateProjectField(project.id, { summary: { ...project.summary, en: v } })}
                  />
                  <Field
                    label="Summary (ja)"
                    value={project.summary.ja}
                    onChange={(v) => updateProjectField(project.id, { summary: { ...project.summary, ja: v } })}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextareaField
                    label="Description (en)"
                    value={project.description.en}
                    onChange={(v) =>
                      updateProjectField(project.id, { description: { ...project.description, en: v } })
                    }
                  />
                  <TextareaField
                    label="Description (ja)"
                    value={project.description.ja}
                    onChange={(v) =>
                      updateProjectField(project.id, { description: { ...project.description, ja: v } })
                    }
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Repository URL"
                    value={project.repositoryUrl}
                    onChange={(v) => updateProjectField(project.id, { repositoryUrl: v })}
                  />
                  <Field
                    label="Website URL"
                    value={project.websiteUrl ?? ""}
                    onChange={(v) => updateProjectField(project.id, { websiteUrl: v || null })}
                  />
                </div>

                <Field
                  label="Technologies (comma-separated)"
                  value={project.technologies.join(", ")}
                  onChange={(v) => updateProjectField(project.id, { technologies: parseList(v) })}
                  className="mt-3"
                />

                <div className="mt-3 flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs text-fg-muted uppercase tracking-[0.1em]">
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={(e) => updateProjectField(project.id, { featured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-xs text-fg-muted uppercase tracking-[0.1em]">
                    <input
                      type="checkbox"
                      checked={project.published}
                      onChange={(e) => updateProjectField(project.id, { published: e.target.checked })}
                    />
                    Published
                  </label>
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => handleSave(project)}
                    disabled={rowStatus.saving}
                    className="group inline-flex items-center gap-2 border border-fg bg-fg px-4 py-2 text-[11px] font-medium tracking-[0.12em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg disabled:opacity-50"
                  >
                    <span className="text-bg group-hover:text-fg-dim">›</span>
                    {rowStatus.saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    disabled={rowStatus.saving}
                    className="text-xs text-red-400 uppercase tracking-[0.1em] hover:text-red-300 disabled:opacity-50"
                  >
                    Delete
                  </button>
                  {rowStatus.saved && (
                    <span className="text-xs tracking-[0.1em] text-fg-muted uppercase">Saved</span>
                  )}
                  {rowStatus.error && <span className="text-xs text-red-400">{rowStatus.error}</span>}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addProject}
            className="group inline-flex w-fit items-center gap-2 border border-border-strong px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase transition-colors hover:border-fg hover:text-fg"
          >
            <span className="text-fg-dim group-hover:text-current">›</span>
            Add project
          </button>
        </div>
      </PanelFrame>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  );
}
