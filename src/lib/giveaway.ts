import { parseIsoDate, startOfDay } from "@/lib/dates";
import type { TestDriveSchedule } from "@/lib/test-drive-schedule";

export function isGiveawayPeriodEnded(schedule: TestDriveSchedule) {
  const endDate = parseIsoDate(schedule.dateTo);
  if (!endDate) {
    return false;
  }

  return startOfDay(new Date()) > endDate;
}
