const MONTHS = [
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

export function formatYearMonth(value: string) {
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  return { year, month: MONTHS[monthIndex] ?? month };
}

export function formatCareerRange(startDate: string, endDate: string | null) {
  const start = formatYearMonth(startDate);
  const end = endDate ? formatYearMonth(endDate) : null;
  return {
    year: start.year,
    range: `${start.month} - ${end ? end.month : "Now"}`,
  };
}
