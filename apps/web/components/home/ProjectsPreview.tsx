"use client";

import { useState } from "react";
import type { Project } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PanelFrame, PanelHeading } from "@kyo8/ui";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectDetailContent from "@/components/projects/ProjectDetailContent";
import Carousel from "@/components/ui/Carousel";
import Modal from "@/components/ui/Modal";

export default function ProjectsPreview({ projects }: { projects: Project[] }) {
  const { t } = useLocale();
  const [selected, setSelected] = useState<Project | null>(null);
  const published = projects.filter((project) => project.published).sort((a, b) => a.order - b.order);

  return (
    <div id="projects" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="03" title={t.projects.pageTitle} />
        <div className="py-6 sm:py-8">
          <Carousel>
            {published.map((project) => (
              <div key={project.id} className="w-72 shrink-0 snap-start sm:w-80">
                <ProjectCard project={project} onClick={() => setSelected(project)} />
              </div>
            ))}
          </Carousel>
        </div>
      </PanelFrame>

      <Modal open={selected !== null} onClose={() => setSelected(null)}>
        {selected && <ProjectDetailContent project={selected} />}
      </Modal>
    </div>
  );
}
