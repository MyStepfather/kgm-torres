export const TEST_DRIVE_MAX_DATE = new Date(2026, 8, 30);
export const ADMIN_DATE_PICKER_MIN = "2020-01-01";
export const ADMIN_DATE_PICKER_MAX = "2030-12-31";

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return startOfDay(date);
}

export function formatTestDriveDate(value: string | Date) {
  const date =
    typeof value === "string"
      ? (parseIsoDate(value.slice(0, 10)) ?? null)
      : startOfDay(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTestDriveDateRange(from: string, to: string) {
  return `${formatTestDriveDate(from)} — ${formatTestDriveDate(to)}`;
}

export function formatTestDrivePeriodLabel(from: string, to: string) {
  const fromParsed = parseIsoDate(from.slice(0, 10));
  const toParsed = parseIsoDate(to.slice(0, 10));
  if (!fromParsed || !toParsed) return "";

  const dayMonthFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  });

  const fromLabel = dayMonthFormatter.format(fromParsed);
  const toLabel = dayMonthFormatter.format(toParsed);
  const fromYear = fromParsed.getFullYear();
  const toYear = toParsed.getFullYear();

  if (fromYear === toYear) {
    return `с ${fromLabel} по ${toLabel} ${toYear}`;
  }

  return `с ${fromLabel} ${fromYear} по ${toLabel} ${toYear}`;
}

export function getCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: Array<Date | null> = [];

  for (let i = 0; i < startOffset; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}
