"use client";

import Link from "next/link";
import type { Project } from "@/types";
import ProjectGraphic from "@/components/projects/ProjectGraphic";
import { ArrowUpRightIcon, GitHubIcon } from "@kyo8/ui";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function ProjectDetailContent({ project }: { project: Project }) {
  const { locale, t } = useLocale();

  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_100%_at_20%_0%,black,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-2 text-xs tracking-[0.15em] text-fg-muted uppercase transition-colors hover:text-fg"
          >
            ← {t.projects.allProjectsLink}
          </Link>
          <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.3em] text-fg-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-fg" />
            {project.year}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight uppercase sm:text-5xl">
            {project.title[locale]}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">{project.summary[locale]}</p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <ProjectGraphic project={project} />

        <div className="mt-14 grid grid-cols-1 gap-16 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              {t.projects.overview}
              <span className="mt-2 block h-px w-8 bg-fg" />
            </h2>
            <p className="text-sm leading-relaxed text-fg-muted sm:text-base">
              {project.description[locale]}
            </p>
          </div>

          <div className="flex flex-col gap-10">
            <div>
              <p className="mb-4 text-[11px] tracking-[0.2em] text-fg-dim uppercase">
                {t.projects.technologies}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="border border-border px-2.5 py-1 text-[11px] tracking-wide text-fg-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="mb-1 text-[11px] tracking-[0.2em] text-fg-dim uppercase">{t.projects.links}</p>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                <GitHubIcon className="h-4 w-4" />
                {t.projects.repository}
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {t.projects.website}
                  <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
