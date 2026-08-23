"use client";

import { useCallback, useEffect, useState } from "react";
import type { Career, CareerType } from "@/types";
import { createCareer, deleteCareer, listCareers, updateCareer } from "@/lib/api/careers";
import { PanelFrame, PanelHeading } from "@kyo8/ui";

const TYPES: CareerType[] = ["work", "internship", "education"];

function newId(): string {
  return `c-${Math.random().toString(36).slice(2, 10)}`;
}

function newCareer(): Career {
  return {
    id: newId(),
    type: "work",
    organization: "",
    position: { en: "", ja: "" },
    startDate: "",
    endDate: null,
    description: { en: "", ja: "" },
    note: "",
    order: 1,
  };
}

interface RowStatus {
  saving: boolean;
  error: string | null;
  saved: boolean;
}

const IDLE_STATUS: RowStatus = { saving: false, error: null, saved: false };

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[] | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, RowStatus>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listCareers();
      setCareers(data);
      setNewIds(new Set());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load careers");
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

  function updateCareerField(id: string, patch: Partial<Career>) {
    setCareers((prev) => prev?.map((c) => (c.id === id ? { ...c, ...patch } : c)) ?? prev);
    setRowStatus(id, { saved: false });
  }

  function addCareer() {
    const career = newCareer();
    setCareers((prev) => [...(prev ?? []), career]);
    setNewIds((prev) => new Set(prev).add(career.id));
  }

  async function handleSave(career: Career) {
    setRowStatus(career.id, { saving: true, error: null, saved: false });
    try {
      if (newIds.has(career.id)) {
        await createCareer(career);
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(career.id);
          return next;
        });
      } else {
        await updateCareer(career);
      }
      setRowStatus(career.id, { saving: false, saved: true });
    } catch (err) {
      setRowStatus(career.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to save career",
      });
    }
  }

  async function handleDelete(career: Career) {
    if (newIds.has(career.id)) {
      setCareers((prev) => prev?.filter((c) => c.id !== career.id) ?? prev);
      return;
    }
    setRowStatus(career.id, { saving: true, error: null });
    try {
      await deleteCareer(career.id);
      setCareers((prev) => prev?.filter((c) => c.id !== career.id) ?? prev);
    } catch (err) {
      setRowStatus(career.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to delete career",
      });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="06" title="Career" />
          <div className="px-6 py-14 text-center">
            <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
              Loading career<span className="animate-blink">_</span>
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
          <PanelHeading number="06" title="Career" />
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

  if (!careers) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PanelFrame className="animate-fade-up">
        <PanelHeading number="06" title="Career" />

        <div className="flex flex-col gap-6 px-6 py-10">
          {careers.map((career) => {
            const rowStatus = getStatus(career.id);
            return (
              <div key={career.id} className="border border-border p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] tracking-[0.1em] text-fg-muted uppercase">Type</span>
                    <select
                      value={career.type}
                      onChange={(e) => updateCareerField(career.id, { type: e.target.value as CareerType })}
                      className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Organization"
                    value={career.organization}
                    onChange={(v) => updateCareerField(career.id, { organization: v })}
                  />
                  <Field
                    label="Order"
                    type="number"
                    value={String(career.order)}
                    onChange={(v) => updateCareerField(career.id, { order: Number(v) })}
                    className="w-20"
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Position (en)"
                    value={career.position.en}
                    onChange={(v) => updateCareerField(career.id, { position: { ...career.position, en: v } })}
                  />
                  <Field
                    label="Position (ja)"
                    value={career.position.ja}
                    onChange={(v) => updateCareerField(career.id, { position: { ...career.position, ja: v } })}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <Field
                    label="Start date"
                    type="month"
                    value={career.startDate}
                    onChange={(v) => updateCareerField(career.id, { startDate: v })}
                    className="w-40"
                  />
                  <Field
                    label="End date"
                    type="month"
                    value={career.endDate ?? ""}
                    onChange={(v) => updateCareerField(career.id, { endDate: v || null })}
                    className="w-40"
                  />
                  <label className="flex items-center gap-2 pb-2.5 text-xs text-fg-muted uppercase tracking-[0.1em]">
                    <input
                      type="checkbox"
                      checked={career.endDate === null}
                      onChange={(e) => updateCareerField(career.id, { endDate: e.target.checked ? null : "" })}
                    />
                    Present
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextareaField
                    label="Description (en)"
                    value={career.description.en}
                    onChange={(v) =>
                      updateCareerField(career.id, { description: { ...career.description, en: v } })
                    }
                  />
                  <TextareaField
                    label="Description (ja)"
                    value={career.description.ja}
                    onChange={(v) =>
                      updateCareerField(career.id, { description: { ...career.description, ja: v } })
                    }
                  />
                </div>

                <Field
                  label="Note"
                  value={career.note}
                  onChange={(v) => updateCareerField(career.id, { note: v })}
                  className="mt-3"
                />

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => handleSave(career)}
                    disabled={rowStatus.saving}
                    className="group inline-flex items-center gap-2 border border-fg bg-fg px-4 py-2 text-[11px] font-medium tracking-[0.12em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg disabled:opacity-50"
                  >
                    <span className="text-bg group-hover:text-fg-dim">›</span>
                    {rowStatus.saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(career)}
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
            onClick={addCareer}
            className="group inline-flex w-fit items-center gap-2 border border-border-strong px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase transition-colors hover:border-fg hover:text-fg"
          >
            <span className="text-fg-dim group-hover:text-current">›</span>
            Add career
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
