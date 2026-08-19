"use client";

import { careers } from "@/lib/data/careers";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import CareerTimeline from "@/components/career/CareerTimeline";

export default function CareerPreview() {
  const { t } = useLocale();

  return (
    <section id="career" className="scroll-anchor">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={t.career.eyebrow}
          title={t.career.title}
          action={{ href: "/career", label: t.career.allLink }}
        />
        <CareerTimeline careers={careers} />
      </div>
    </section>
  );
}
