"use client";

import type { Project } from "@/types";
import ProjectGraphic from "@/components/projects/ProjectGraphic";
import { ArrowUpRightIcon, GitHubIcon } from "@kyo8/ui";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function ProjectDetailContent({ project }: { project: Project }) {
  const { locale, t } = useLocale();

  return (
    <div>
      <ProjectGraphic project={project} />

      <div className="p-6 sm:p-10">
        <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.3em] text-fg-muted uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-fg" />
          {project.year}
        </p>
        <h1 className="max-w-xl pr-8 text-2xl font-bold tracking-tight uppercase sm:text-3xl">
          {project.title[locale]}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">{project.summary[locale]}</p>

        <div className="mt-10 flex flex-col gap-10">
          <div>
            <h2 className="mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              {t.projects.overview}
              <span className="mt-2 block h-px w-8 bg-fg" />
            </h2>
            <p className="text-sm leading-relaxed text-fg-muted sm:text-base">{project.description[locale]}</p>
          </div>

          <div>
            <p className="mb-4 text-[11px] tracking-[0.2em] text-fg-dim uppercase">{t.projects.technologies}</p>
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
    </div>
  );
}
