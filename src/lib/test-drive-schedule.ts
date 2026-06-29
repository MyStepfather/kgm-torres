import {
  parseIsoDate,
  startOfDay,
  toIsoDate,
  TEST_DRIVE_MAX_DATE,
} from "@/lib/dates";

export const TEST_DRIVE_SCHEDULE_KEY = "test_drive_schedule";

export type TestDriveSchedule = {
  dateFrom: string;
  dateTo: string;
  excludedDates: string[];
};

export function getDefaultTestDriveSchedule(): TestDriveSchedule {
  return {
    dateFrom: toIsoDate(startOfDay(new Date())),
    dateTo: toIsoDate(startOfDay(TEST_DRIVE_MAX_DATE)),
    excludedDates: [],
  };
}

function uniqueSortedDates(dates: string[]) {
  return [...new Set(dates.map((d) => d.slice(0, 10)))].sort();
}

export function normalizeTestDriveSchedule(
  input: Partial<TestDriveSchedule> | null | undefined,
): TestDriveSchedule {
  const defaults = getDefaultTestDriveSchedule();
  const dateFrom = input?.dateFrom?.slice(0, 10) ?? defaults.dateFrom;
  const dateTo = input?.dateTo?.slice(0, 10) ?? defaults.dateTo;
  const excludedDates = uniqueSortedDates(input?.excludedDates ?? []);

  const from = parseIsoDate(dateFrom);
  const to = parseIsoDate(dateTo);

  if (!from || !to) {
    return defaults;
  }

  const normalizedFrom = from <= to ? dateFrom : dateTo;
  const normalizedTo = from <= to ? dateTo : dateFrom;

  const filteredExclusions = excludedDates.filter((iso) => {
    const date = parseIsoDate(iso);
    if (!date) return false;
    const rangeFrom = parseIsoDate(normalizedFrom)!;
    const rangeTo = parseIsoDate(normalizedTo)!;
    return date >= rangeFrom && date <= rangeTo;
  });

  return {
    dateFrom: normalizedFrom,
    dateTo: normalizedTo,
    excludedDates: filteredExclusions,
  };
}

export function getEffectiveMinDate(schedule: TestDriveSchedule) {
  const today = startOfDay(new Date());
  const from = parseIsoDate(schedule.dateFrom)!;
  return from > today ? from : today;
}

export function isDateInRange(isoDate: string, schedule: TestDriveSchedule) {
  const date = parseIsoDate(isoDate.slice(0, 10));
  const from = parseIsoDate(schedule.dateFrom);
  const to = parseIsoDate(schedule.dateTo);
  if (!date || !from || !to) return false;
  return date >= from && date <= to;
}

export function isDateSelectable(
  isoDate: string,
  schedule: TestDriveSchedule,
) {
  const date = parseIsoDate(isoDate.slice(0, 10));
  if (!date) return false;

  const min = getEffectiveMinDate(schedule);
  const max = parseIsoDate(schedule.dateTo);
  if (!max) return false;

  if (date < min || date > max) return false;
  return !schedule.excludedDates.includes(toIsoDate(date));
}

export function isValidTestDriveDate(
  value: string,
  schedule: TestDriveSchedule,
) {
  return isDateSelectable(value, schedule);
}

export function getSelectableBounds(schedule: TestDriveSchedule) {
  return {
    min: toIsoDate(getEffectiveMinDate(schedule)),
    max: schedule.dateTo,
  };
}

export function isTestDriveRegistrationOpen(schedule: TestDriveSchedule) {
  const endDate = parseIsoDate(schedule.dateTo);
  if (!endDate) {
    return false;
  }

  return startOfDay(new Date()) <= endDate;
}

export function validateTestDriveScheduleInput(
  schedule: TestDriveSchedule,
): string | null {
  const from = parseIsoDate(schedule.dateFrom);
  const to = parseIsoDate(schedule.dateTo);

  if (!from || !to) {
    return "Укажите корректный период проведения тест-драйва";
  }

  if (from > to) {
    return "Дата «С» не может быть позже даты «По»";
  }

  for (const excluded of schedule.excludedDates) {
    if (!isDateInRange(excluded, schedule)) {
      return `Дата-исключение ${excluded} выходит за пределы периода`;
    }
  }

  const min = getEffectiveMinDate(schedule);
  if (to < min) {
    return "Период тест-драйва полностью в прошлом";
  }

  return null;
}
