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

export function formatDate(value: string, locale: Locale) {
  const [year, month, day] = value.split("-").map(Number);
  if (locale === "ja") return `${year}年${month}月${day}日`;
  return `${MONTHS_EN[month - 1]} ${day}, ${year}`;
}

function formatYearMonth(value: string): string {
  const [year, month] = value.split("-");
  return `${year}.${month.padStart(2, "0")}`;
}

export function formatCareerRange(startDate: string, endDate: string | null, now: string) {
  return {
    start: formatYearMonth(startDate),
    end: endDate ? formatYearMonth(endDate) : now,
  };
}
