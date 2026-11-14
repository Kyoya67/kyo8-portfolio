import Hero from "@/components/home/Hero";
import AboutPreview from "@/components/home/AboutPreview";
import SkillsPreview from "@/components/home/SkillsPreview";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import ArticlesPreview from "@/components/home/ArticlesPreview";
import CareerPreview from "@/components/home/CareerPreview";
import { getProfileOrFallback } from "@/lib/api/profile";
import { getSkillsOrFallback } from "@/lib/api/skills";
import { getProjectsOrFallback } from "@/lib/api/projects";
import { getArticlesOrFallback } from "@/lib/api/articles";
import { getCareersOrFallback } from "@/lib/api/careers";

import { getCertificationsOrEmpty } from "@/lib/api/certifications";

export default async function Home() {
  const [profile, skills, projects, articles, careers, certifications] = await Promise.all([
    getProfileOrFallback(),
    getSkillsOrFallback(),
    getProjectsOrFallback(),
    getArticlesOrFallback(),
    getCareersOrFallback(),
    getCertificationsOrEmpty(),
  ]);

  return (
    <>
      <Hero profile={profile} />
      <AboutPreview profile={profile} certifications={certifications} />
      <SkillsPreview skills={skills} />
      <ProjectsPreview projects={projects} />
      <ArticlesPreview articles={articles} />
      <CareerPreview careers={careers} />
    </>
  );
}
