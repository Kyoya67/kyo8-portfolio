"use client";

import { useCallback, useEffect, useState } from "react";
import type { Skill, SkillCategory, SkillChild } from "@/types";
import { getSkills, updateSkills } from "@/lib/api/skills";
import { PanelFrame, PanelHeading } from "@kyo8/ui";

const CATEGORIES: SkillCategory[] = ["frontend", "backend", "infrastructure", "database", "blockchain"];

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function newChild(): SkillChild {
  return { id: newId("child"), name: "", capabilities: [] };
}

function newSkill(): Skill {
  return { id: newId("skill"), name: "", category: "frontend", order: 1, capabilities: [], children: [] };
}

function parseCapabilities(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load skills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount; `load` also drives the retry button.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function updateSkill(id: string, patch: Partial<Skill>) {
    setSkills((prev) => prev?.map((s) => (s.id === id ? { ...s, ...patch } : s)) ?? prev);
    setSaved(false);
  }

  function removeSkill(id: string) {
    setSkills((prev) => prev?.filter((s) => s.id !== id) ?? prev);
    setSaved(false);
  }

  function addSkill() {
    setSkills((prev) => [...(prev ?? []), newSkill()]);
    setSaved(false);
  }

  function updateChild(skillId: string, childId: string, patch: Partial<SkillChild>) {
    setSkills(
      (prev) =>
        prev?.map((s) =>
          s.id === skillId
            ? { ...s, children: s.children.map((c) => (c.id === childId ? { ...c, ...patch } : c)) }
            : s
        ) ?? prev
    );
    setSaved(false);
  }

  function removeChild(skillId: string, childId: string) {
    setSkills(
      (prev) =>
        prev?.map((s) =>
          s.id === skillId ? { ...s, children: s.children.filter((c) => c.id !== childId) } : s
        ) ?? prev
    );
    setSaved(false);
  }

  function addChild(skillId: string) {
    setSkills(
      (prev) => prev?.map((s) => (s.id === skillId ? { ...s, children: [...s.children, newChild()] } : s)) ?? prev
    );
    setSaved(false);
  }

  async function handleSave() {
    if (!skills) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await updateSkills(skills);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update skills");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="03" title="Skills" />
          <div className="px-6 py-14 text-center">
            <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
              Loading skills<span className="animate-blink">_</span>
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
          <PanelHeading number="03" title="Skills" />
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

  if (!skills) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PanelFrame className="animate-fade-up">
        <PanelHeading number="03" title="Skills" />

        <div className="flex flex-col gap-6 px-6 py-10">
          {skills.map((skill) => (
            <div key={skill.id} className="border border-border p-4">
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex flex-1 min-w-[10rem] flex-col gap-1.5">
                  <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">Name</span>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">Category</span>
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, { category: e.target.value as SkillCategory })}
                    className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex w-20 flex-col gap-1.5">
                  <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">Order</span>
                  <input
                    type="number"
                    value={skill.order}
                    onChange={(e) => updateSkill(skill.id, { order: Number(e.target.value) })}
                    className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-xs text-red-400 uppercase tracking-[0.1em] hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <label className="mt-3 flex flex-col gap-1.5">
                <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">
                  Capabilities (comma-separated)
                </span>
                <input
                  type="text"
                  value={skill.capabilities.join(", ")}
                  onChange={(e) => updateSkill(skill.id, { capabilities: parseCapabilities(e.target.value) })}
                  className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                />
              </label>

              <div className="mt-4 flex flex-col gap-3 border-l border-border pl-4">
                {skill.children.map((child) => (
                  <div key={child.id} className="flex flex-wrap items-end gap-3">
                    <label className="flex flex-1 min-w-[8rem] flex-col gap-1.5">
                      <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">Child name</span>
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => updateChild(skill.id, child.id, { name: e.target.value })}
                        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                      />
                    </label>
                    <label className="flex flex-1 min-w-[10rem] flex-col gap-1.5">
                      <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">
                        Capabilities (comma-separated)
                      </span>
                      <input
                        type="text"
                        value={child.capabilities.join(", ")}
                        onChange={(e) =>
                          updateChild(skill.id, child.id, { capabilities: parseCapabilities(e.target.value) })
                        }
                        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeChild(skill.id, child.id)}
                      className="text-xs text-red-400 uppercase tracking-[0.1em] hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addChild(skill.id)}
                  className="self-start text-xs text-fg-muted uppercase tracking-[0.1em] hover:text-fg"
                >
                  + Add child
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSkill}
            className="group inline-flex w-fit items-center gap-2 border border-border-strong px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase transition-colors hover:border-fg hover:text-fg"
          >
            <span className="text-fg-dim group-hover:text-current">›</span>
            Add skill
          </button>

          <div className="flex items-center gap-4 border-t border-border pt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="group inline-flex items-center gap-2 border border-fg bg-fg px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg disabled:opacity-50"
            >
              <span className="text-bg group-hover:text-fg-dim">›</span>
              {saving ? "Saving…" : "Save"}
            </button>
            {saved && <span className="text-xs tracking-[0.1em] text-fg-muted uppercase">Saved</span>}
            {saveError && <span className="text-xs text-red-400">{saveError}</span>}
          </div>
        </div>
      </PanelFrame>
    </div>
  );
}
