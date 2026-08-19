"use client";

import { careers } from "@/lib/data/careers";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import PanelFrame from "@/components/ui/PanelFrame";
import PanelHeading from "@/components/ui/PanelHeading";
import CareerTimeline from "@/components/career/CareerTimeline";

export default function CareerPreview() {
  const { t } = useLocale();

  return (
    <div id="career" className="scroll-anchor mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <PanelFrame>
        <PanelHeading number="04" title={t.career.title} action={{ href: "/career", label: t.career.allLink }} />
        <div className="p-6 sm:p-10">
          <CareerTimeline careers={careers} />
        </div>
      </PanelFrame>
    </div>
  );
}
