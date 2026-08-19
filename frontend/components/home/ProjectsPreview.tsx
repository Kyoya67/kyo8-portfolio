"use client";

import { projects } from "@/lib/data/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsPreview() {
  const { t } = useLocale();
  const featured = projects
    .filter((project) => project.published && project.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <section id="projects" className="scroll-anchor border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={t.projects.eyebrow}
          title={t.projects.title}
          action={{ href: "/projects", label: t.projects.allLink }}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
