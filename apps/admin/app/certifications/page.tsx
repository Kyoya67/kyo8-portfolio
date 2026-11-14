"use client";

import { useCallback, useEffect, useState } from "react";
import type { Certification } from "@/types";
import { createCertification, deleteCertification, listCertifications, updateCertification } from "@/lib/api/certifications";
import { PanelFrame, PanelHeading } from "@kyo8/ui";

function newCertification(): Certification {
  return {
    id: crypto.randomUUID(),
    name: { en: "", ja: "" },
    issuer: "",
    acquiredDate: "",
    order: 1,
  };
}

interface RowStatus {
  saving: boolean;
  error: string | null;
  saved: boolean;
}

const IDLE_STATUS: RowStatus = { saving: false, error: null, saved: false };

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[] | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, RowStatus>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listCertifications();
      setCertifications(data);
      setNewIds(new Set());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load certifications");
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

  function updateCertificationField(id: string, patch: Partial<Certification>) {
    setCertifications((prev) => prev?.map((c) => (c.id === id ? { ...c, ...patch } : c)) ?? prev);
    setRowStatus(id, { saved: false });
  }

  function addCertification() {
    const certification = newCertification();
    setCertifications((prev) => [...(prev ?? []), certification]);
    setNewIds((prev) => new Set(prev).add(certification.id));
  }

  async function handleSave(certification: Certification) {
    setRowStatus(certification.id, { saving: true, error: null, saved: false });
    try {
      if (newIds.has(certification.id)) {
        await createCertification(certification);
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(certification.id);
          return next;
        });
      } else {
        await updateCertification(certification);
      }
      setRowStatus(certification.id, { saving: false, saved: true });
    } catch (err) {
      setRowStatus(certification.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to save certification",
      });
    }
  }

  async function handleDelete(certification: Certification) {
    if (newIds.has(certification.id)) {
      setCertifications((prev) => prev?.filter((c) => c.id !== certification.id) ?? prev);
      setNewIds((prev) => { const next = new Set(prev); next.delete(certification.id); return next; });
      return;
    }
    if (!window.confirm("この資格を削除しますか？ / Delete this certification?")) return;
    setRowStatus(certification.id, { saving: true, error: null });
    try {
      await deleteCertification(certification.id);
      setCertifications((prev) => prev?.filter((c) => c.id !== certification.id) ?? prev);
    } catch (err) {
      setRowStatus(certification.id, {
        saving: false,
        error: err instanceof Error ? err.message : "Failed to delete certification",
      });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="07" title="Certifications / 保有資格" />
          <div className="px-6 py-14 text-center">
            <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
              Loading certification<span className="animate-blink">_</span>
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
          <PanelHeading number="07" title="Certifications / 保有資格" />
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

  if (!certifications) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PanelFrame className="animate-fade-up">
        <PanelHeading number="07" title="Certifications / 保有資格" />

        <div className="flex flex-col gap-6 px-6 py-10">
          {certifications.length === 0 && <p className="text-sm text-fg-muted">資格はまだ登録されていません。 / No certifications yet.</p>}
          {certifications.map((certification) => {
            const rowStatus = getStatus(certification.id);
            return (
              <form key={certification.id} className="border border-border p-4" onSubmit={(event) => { event.preventDefault(); void handleSave(certification); }}>
                <fieldset disabled={rowStatus.saving} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="資格名 (ja)" value={certification.name.ja}
                    onChange={(ja) => updateCertificationField(certification.id, { name: { ...certification.name, ja } })} />
                  <Field label="Name (en)" value={certification.name.en}
                    onChange={(en) => updateCertificationField(certification.id, { name: { ...certification.name, en } })} />
                  <Field label="発行元 / Issuer" value={certification.issuer}
                    onChange={(issuer) => updateCertificationField(certification.id, { issuer })} />
                  <Field label="取得月 / Acquired month" type="month" value={certification.acquiredDate}
                    onChange={(acquiredDate) => updateCertificationField(certification.id, { acquiredDate })} />
                  <Field label="表示順 / Order" type="number" value={String(certification.order)}
                    onChange={(order) => updateCertificationField(certification.id, { order: Number(order) })} />
                </fieldset>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                  <button
                    type="submit"
                    disabled={rowStatus.saving}
                    className="group inline-flex items-center gap-2 border border-fg bg-fg px-4 py-2 text-[11px] font-medium tracking-[0.12em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg disabled:opacity-50"
                  >
                    <span className="text-bg group-hover:text-fg-dim">›</span>
                    {rowStatus.saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(certification)}
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
              </form>
            );
          })}

          <button
            type="button"
            onClick={addCertification}
            className="group inline-flex w-fit items-center gap-2 border border-border-strong px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase transition-colors hover:border-fg hover:text-fg"
          >
            <span className="text-fg-dim group-hover:text-current">›</span>
            Add certification
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
        required
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? 1 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  );
}
