"use client";

import Link from "next/link";
import type { Project } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import ProjectGraphic from "./ProjectGraphic";

export default function ProjectCard({ project }: { project: Project }) {
  const { locale } = useLocale();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-border transition-colors hover:border-border-strong"
    >
      <ProjectGraphic project={project} />
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold tracking-wide">{project.title}</h3>
          <span className="text-[11px] text-fg-dim">{project.year}</span>
        </div>
        <p className="mb-5 text-xs leading-relaxed text-fg-muted">{project.summary[locale]}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="border border-border px-2 py-1 text-[10px] tracking-wide text-fg-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
