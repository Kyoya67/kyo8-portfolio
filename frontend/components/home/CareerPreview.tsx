import { careers } from "@/lib/data/careers";
import SectionHeading from "@/components/ui/SectionHeading";
import CareerTimeline from "@/components/career/CareerTimeline";

export default function CareerPreview() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading eyebrow="Journey" title="Career" action={{ href: "/career", label: "Full timeline" }} />
        <CareerTimeline careers={careers} />
      </div>
    </section>
  );
}
