import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projects — KYO8",
  description: "Things I've built — backend systems, infrastructure, and tooling.",
};

export default function ProjectsPage() {
  const published = projects
    .filter((project) => project.published)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Projects"
        description="A selection of systems and tools I've designed and built end to end."
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
