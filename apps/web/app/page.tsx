import Hero from "@/components/home/Hero";
import AboutPreview from "@/components/home/AboutPreview";
import SkillsPreview from "@/components/home/SkillsPreview";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import ArticlesPreview from "@/components/home/ArticlesPreview";
import CareerPreview from "@/components/home/CareerPreview";
import { getProfileOrFallback } from "@/lib/api/profile";
import { getSkillsOrFallback } from "@/lib/api/skills";
import { getProjectsOrFallback } from "@/lib/api/projects";

export default async function Home() {
  const [profile, skills, projects] = await Promise.all([
    getProfileOrFallback(),
    getSkillsOrFallback(),
    getProjectsOrFallback(),
  ]);

  return (
    <>
      <Hero profile={profile} />
      <AboutPreview profile={profile} />
      <SkillsPreview skills={skills} />
      <ProjectsPreview projects={projects} />
      <ArticlesPreview />
      <CareerPreview />
    </>
  );
}
