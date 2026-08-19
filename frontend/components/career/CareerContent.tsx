"use client";

import PageHeader from "@/components/ui/PageHeader";
import CareerTimeline from "@/components/career/CareerTimeline";
import { careers } from "@/lib/data/careers";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function CareerContent() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader eyebrow={t.career.eyebrow} title={t.career.title} description={t.career.pageDescription} />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <CareerTimeline careers={careers} />
      </section>
    </>
  );
}
