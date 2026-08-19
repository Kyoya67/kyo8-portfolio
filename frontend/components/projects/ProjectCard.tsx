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
      className="group block bg-bg transition-colors hover:bg-bg-inset"
    >
      <div className="relative">
        <span className="absolute top-0 left-0 z-10 border-r border-b border-border-strong bg-bg px-2 py-1 text-[10px] text-fg-dim">
          {String(project.order).padStart(2, "0")}
        </span>
        <ProjectGraphic project={project} />
      </div>
      <div className="border-t border-border-strong p-6">
        <h3 className="mb-2 text-sm font-bold tracking-wide">{project.title}</h3>
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
