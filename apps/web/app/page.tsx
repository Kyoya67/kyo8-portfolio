import Hero from "@/components/home/Hero";
import AboutPreview from "@/components/home/AboutPreview";
import SkillsPreview from "@/components/home/SkillsPreview";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import ArticlesPreview from "@/components/home/ArticlesPreview";
import CareerPreview from "@/components/home/CareerPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <SkillsPreview />
      <ProjectsPreview />
      <ArticlesPreview />
      <CareerPreview />
    </>
  );
}
