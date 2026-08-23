"use client";

import { PageHeader } from "@kyo8/ui";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function ProjectsContent({ projects }: { projects: Project[] }) {
  const { t } = useLocale();
  const published = projects.filter((project) => project.published).sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHeader
        eyebrow={t.projects.pageEyebrow}
        title={t.projects.pageTitle}
        description={t.projects.pageDescription}
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
