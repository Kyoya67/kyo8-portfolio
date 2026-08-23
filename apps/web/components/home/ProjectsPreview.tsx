"use client";

import { projects } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PanelFrame } from "@kyo8/ui";
import { PanelHeading } from "@kyo8/ui";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsPreview() {
  const { t } = useLocale();
  const featured = projects
    .filter((project) => project.published && project.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <div id="projects" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading
          number="03"
          title={t.projects.pageTitle}
          action={{ href: "/projects", label: t.projects.allLink }}
        />
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </PanelFrame>
    </div>
  );
}
