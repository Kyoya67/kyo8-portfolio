import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import CareerTimeline from "@/components/career/CareerTimeline";
import { careers } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Career — KYO8",
  description: "Work, internship, and education history.",
};

export default function CareerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journey"
        title="Career"
        description="Work, internships, and education — in chronological order."
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <CareerTimeline careers={careers} />
      </section>
    </>
  );
}
