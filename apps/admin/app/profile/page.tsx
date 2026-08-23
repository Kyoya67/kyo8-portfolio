"use client";

import { useCallback, useEffect, useState } from "react";
import type { Profile } from "@/types";
import { getProfile, updateProfile } from "@/lib/api/profile";

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
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-sm text-zinc-500">Loading profile…</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="mb-4 text-sm text-red-600">{loadError}</p>
        <button
          type="button"
          onClick={load}
          className="rounded border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Retry
        </button>
      </main>
    );
  }

  if (!form) return null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-xl font-semibold">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Field label="Name" value={form.name} onChange={(v) => updateField("name", v)} />
        <Field label="Handle" value={form.handle} onChange={(v) => updateField("handle", v)} />
        <Field
          label="Headline (ja)"
          value={form.headlineJa}
          onChange={(v) => updateField("headlineJa", v)}
        />
        <TextareaField label="Bio (ja)" value={form.bioJa} onChange={(v) => updateField("bioJa", v)} />
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

        <p className="text-xs text-zinc-500">
          英語表記（en）はフロントエンド側の固定値です。ここでは日本語（ja）のみ編集できます。
        </p>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
          {saveError && <span className="text-sm text-red-600">{saveError}</span>}
        </div>
      </form>
    </main>
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
      <span className="text-xs font-medium text-zinc-600">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
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
      <span className="text-xs font-medium text-zinc-600">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
      />
    </label>
  );
}
