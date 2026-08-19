import Link from "next/link";
import { profile } from "@/lib/data/profile";
import TerminalPanel from "@/components/ui/TerminalPanel";

export default function AboutPreview() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-24 md:grid-cols-2 md:gap-20">
        <div>
          <h2 className="mb-6 text-sm font-bold tracking-[0.2em] uppercase">
            About
            <span className="mt-2 block h-px w-8 bg-fg" />
          </h2>
          <p className="text-lg leading-relaxed text-fg sm:text-xl">
            {profile.headline} based in {profile.location}.
            <br />
            <span className="text-fg-muted">
              I enjoy building systems that scale and solving complex problems with elegant
              design.
            </span>
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/about"
              className="inline-flex w-fit items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <span className="text-fg-dim">{">"}</span> More about me
            </Link>
            <a
              href="/resume.pdf"
              className="inline-flex w-fit items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <span className="text-fg-dim">{">"}</span> Resume (PDF)
            </a>
          </div>
        </div>

        <TerminalPanel
          lines={[
            { key: "name", value: profile.name.toUpperCase() },
            { key: "role", value: profile.headline },
            { key: "location", value: profile.location },
            { key: "focus", value: profile.focus.join(", ") },
          ]}
        />
      </div>
    </section>
  );
}
