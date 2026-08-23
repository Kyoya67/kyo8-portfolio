import Hero from "@/components/home/Hero";
import AboutPreview from "@/components/home/AboutPreview";
import SkillsPreview from "@/components/home/SkillsPreview";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import ArticlesPreview from "@/components/home/ArticlesPreview";
import CareerPreview from "@/components/home/CareerPreview";
import { getProfileOrFallback } from "@/lib/api/profile";

export default async function Home() {
  const profile = await getProfileOrFallback();

  return (
    <>
      <Hero profile={profile} />
      <AboutPreview profile={profile} />
      <SkillsPreview />
      <ProjectsPreview />
      <ArticlesPreview />
      <CareerPreview />
    </>
  );
}
