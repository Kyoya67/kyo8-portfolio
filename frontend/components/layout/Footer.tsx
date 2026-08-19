import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
          <h2 className="max-w-xl text-4xl leading-[1.15] font-bold tracking-tight uppercase sm:text-5xl">
            Let&apos;s
            <br />
            build something
            <br />
            great.
          </h2>

          <div className="hidden h-24 w-px rotate-[20deg] bg-border-strong md:block" />

          <div className="flex flex-col items-start gap-5">
            <p className="text-sm text-fg-muted">
              Have a project in mind?
              <br />
              Let&apos;s connect.
            </p>
            <a
              href={profile.email ?? "#"}
              className="group inline-flex items-center gap-2 border border-fg bg-fg px-6 py-3 text-xs font-semibold tracking-[0.15em] text-bg uppercase transition-colors hover:bg-transparent hover:text-fg"
            >
              Get in touch
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 text-xs text-fg-dim sm:flex-row sm:justify-between">
          <p>
            © {year} {profile.handle}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              GitHub
            </Link>
            {profile.xUrl && (
              <Link
                href={profile.xUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
              >
                <XIcon className="h-3.5 w-3.5" />
                X (Twitter)
              </Link>
            )}
            {profile.linkedinUrl && (
              <Link
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
              >
                <LinkedInIcon className="h-3.5 w-3.5" />
                LinkedIn
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
