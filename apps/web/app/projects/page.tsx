import type { Metadata } from "next";
import ProjectsContent from "@/components/projects/ProjectsContent";
import { getProjectsOrFallback } from "@/lib/api/projects";

export const metadata: Metadata = {
  title: "Projects — KYO8",
  description: "Things I've built — backend systems, infrastructure, and tooling.",
};

export default async function ProjectsPage() {
  const projects = await getProjectsOrFallback();
  return <ProjectsContent projects={projects} />;
}
