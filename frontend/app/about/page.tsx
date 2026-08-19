import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import TerminalPanel from "@/components/ui/TerminalPanel";
import { profile } from "@/lib/data/profile";

export const metadata: Metadata = {
  title: "About — KYO8",
  description: profile.bio,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Profile" title="About" description={profile.headline} />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-fg-muted sm:text-base">
            <p>
              I&apos;m {profile.name}, a {profile.headline.toLowerCase()} based in{" "}
              {profile.location}. {profile.bio}
            </p>
            <p>
              I care about the layers most people don&apos;t see — request routing, data
              modeling, deployment pipelines, and the infrastructure that keeps a system
              honest under load. Good architecture is invisible when it works and obvious
              when it doesn&apos;t; I try to build the former.
            </p>
            <p>
              Outside of backend work I spend time exploring blockchain infrastructure and
              media-driven technology, treating each project as a chance to understand a
              system from the protocol up.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {profile.focus.map((item) => (
                <span
                  key={item}
                  className="border border-border px-3 py-1.5 text-xs tracking-wide text-fg-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <TerminalPanel
            lines={[
              { key: "name", value: profile.name.toUpperCase() },
              { key: "role", value: profile.headline },
              { key: "location", value: profile.location },
              { key: "focus", value: profile.focus.join(", ") },
              { key: "status", value: "open to interesting problems" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
