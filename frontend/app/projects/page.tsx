import type { Metadata } from "next";
import ProjectsContent from "@/components/projects/ProjectsContent";

export const metadata: Metadata = {
  title: "Projects — KYO8",
  description: "Things I've built — backend systems, infrastructure, and tooling.",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
