import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data/projects";
import ProjectDetailContent from "@/components/projects/ProjectDetailContent";

export function generateStaticParams() {
  return projects.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

function getProject(slug: string) {
  return projects.find((p) => p.slug === slug && p.published);
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — KYO8`,
    description: project.summary.en,
  };
}

export default async function ProjectDetailPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectDetailContent project={project} />;
}
