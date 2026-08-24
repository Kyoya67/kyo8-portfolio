"use client";

import type { Career } from "@/types";
import { formatCareerRange } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function CareerTimeline({ careers }: { careers: Career[] }) {
  const { locale, t } = useLocale();
  const sorted = [...careers].sort((a, b) => b.order - a.order);

  return (
    <div className="relative">
      <div className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />
      <ol className="flex flex-col gap-14">
        {sorted.map((career) => {
          const { start, end } = formatCareerRange(career.startDate, career.endDate, t.career.now);
          return (
            <li key={career.id} className="relative pl-14">
              <span className="absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full border border-fg bg-bg" />

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex gap-8">
                  <div className="w-20 shrink-0">
                    <p className="text-sm font-bold tracking-tight">
                      {end} -<br />
                      {start}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] tracking-[0.2em] text-fg-dim uppercase">
                      {t.career.types[career.type]}
                    </p>
                    <h3 className="text-base font-bold">{career.organization}</h3>
                    <p className="mt-0.5 text-sm text-fg-muted">{career.position[locale]}</p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                      {career.description[locale]}
                    </p>
                  </div>
                </div>

                <p className="hidden shrink-0 text-xs text-fg-dim sm:block">
                  {"// "}
                  {career.note}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
