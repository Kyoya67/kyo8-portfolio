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

export function formatDate(value: string, locale: Locale) {
  const [year, month, day] = value.split("-").map(Number);
  if (locale === "ja") return `${year}年${month}月${day}日`;
  return `${MONTHS_EN[month - 1]} ${day}, ${year}`;
}

export function formatCareerRange(startDate: string, endDate: string | null, locale: Locale, now: string) {
  const start = formatMonth(startDate, locale);
  const end = endDate ? formatMonth(endDate, locale) : null;
  return {
    year: start.year,
    range: `${start.month} - ${end ? end.month : now}`,
  };
}
