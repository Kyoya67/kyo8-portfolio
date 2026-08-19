import type { Locale } from "@/types";

const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonth(value: string, locale: Locale) {
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  if (locale === "ja") return { year, month: `${Number(month)}月` };
  return { year, month: MONTHS_EN[monthIndex] ?? month };
}

export function formatCareerRange(startDate: string, endDate: string | null, locale: Locale, now: string) {
  const start = formatMonth(startDate, locale);
  const end = endDate ? formatMonth(endDate, locale) : null;
  return {
    year: start.year,
    range: `${start.month} - ${end ? end.month : now}`,
  };
}
