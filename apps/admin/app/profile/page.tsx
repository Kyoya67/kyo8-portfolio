"use client";

import { useCallback, useEffect, useState } from "react";
import type { Profile } from "@/types";
import { getProfile, updateProfile } from "@/lib/api/profile";
import { PanelFrame, PanelHeading } from "@kyo8/ui";

interface FormState {
  name: string;
  handle: string;
  headlineJa: string;
  bioJa: string;
  locationJa: string;
  focus: string;
  githubUrl: string;
  linkedinUrl: string;
  xUrl: string;
  email: string;
}

function toFormState(profile: Profile): FormState {
  return {
    name: profile.name,
    handle: profile.handle,
    headlineJa: profile.headline.ja,
    bioJa: profile.bio.ja,
    locationJa: profile.location.ja,
    focus: profile.focus.join(", "),
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl ?? "",
    xUrl: profile.xUrl ?? "",
    email: profile.email ?? "",
  };
}

function toProfile(base: Profile, form: FormState): Profile {
  return {
    ...base,
    name: form.name,
    handle: form.handle,
    headline: { ...base.headline, ja: form.headlineJa },
    bio: { ...base.bio, ja: form.bioJa },
    location: { ...base.location, ja: form.locationJa },
    focus: form.focus
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    githubUrl: form.githubUrl,
    linkedinUrl: form.linkedinUrl || null,
    xUrl: form.xUrl || null,
    email: form.email || null,
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getProfile();
      setProfile(data);
      setForm(toFormState(data));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount; `load` also drives the retry button and the post-save refetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !form) return;

    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await updateProfile(toProfile(profile, form));
      setSaved(true);
      await load();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="02" title="Profile" />
          <div className="px-6 py-14 text-center">
            <p className="text-xs tracking-[0.15em] text-fg-dim uppercase">
              Loading profile<span className="animate-blink">_</span>
            </p>
          </div>
        </PanelFrame>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <PanelFrame className="animate-fade-up">
          <PanelHeading number="02" title="Profile" />
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

  if (!form) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <PanelFrame className="animate-fade-up">
        <PanelHeading number="02" title="Profile" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-10">
          <Field label="Name" value={form.name} onChange={(v) => updateField("name", v)} />
          <Field label="Handle" value={form.handle} onChange={(v) => updateField("handle", v)} />
          <Field
            label="Headline (ja)"
            value={form.headlineJa}
            onChange={(v) => updateField("headlineJa", v)}
          />
          <TextareaField
            label="Bio (ja)"
            value={form.bioJa}
            onChange={(v) => updateField("bioJa", v)}
          />
          <Field
            label="Location (ja)"
            value={form.locationJa}
            onChange={(v) => updateField("locationJa", v)}
          />
          <Field
            label="Focus (comma-separated)"
            value={form.focus}
            onChange={(v) => updateField("focus", v)}
          />
          <Field
            label="GitHub URL"
            value={form.githubUrl}
            onChange={(v) => updateField("githubUrl", v)}
          />
          <Field
            label="LinkedIn URL"
            value={form.linkedinUrl}
            onChange={(v) => updateField("linkedinUrl", v)}
          />
          <Field label="X URL" value={form.xUrl} onChange={(v) => updateField("xUrl", v)} />
          <Field label="Email" value={form.email} onChange={(v) => updateField("email", v)} />

          <p className="border-t border-border pt-6 text-[11px] tracking-[0.05em] text-fg-dim">
            › 英語表記（en）はフロントエンド側の固定値です。ここでは日本語（ja）のみ編集できます。
          </p>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="group inline-flex items-center gap-2 border border-fg bg-fg px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg disabled:opacity-50"
            >
              <span className="text-bg group-hover:text-fg-dim">›</span>
              {saving ? "Saving…" : "Save"}
            </button>
            {saved && (
              <span className="text-xs tracking-[0.1em] text-fg-muted uppercase">Saved</span>
            )}
            {saveError && <span className="text-xs text-red-400">{saveError}</span>}
          </div>
        </form>
      </PanelFrame>
    </div>
  );
}

function Field({
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
      <input
        type="text"
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
        rows={5}
        className="border border-border bg-bg-inset px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  );
}
