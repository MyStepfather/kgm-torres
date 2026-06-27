import { formatTestDriveDate, formatTestDrivePeriodLabel } from "@/lib/dates";
import {
  getDefaultGiveawayDate,
  GIVEAWAY_DATE_KEY,
  normalizeGiveawayDateSetting,
  type GiveawayDateSetting,
} from "@/lib/giveaway-settings";
import { prisma } from "@/lib/prisma";
import {
  getDefaultTestDriveSchedule,
  normalizeTestDriveSchedule,
  TEST_DRIVE_SCHEDULE_KEY,
  type TestDriveSchedule,
} from "@/lib/test-drive-schedule";

export async function getTestDriveSchedule(): Promise<TestDriveSchedule> {
  const existing = await prisma.setting.findUnique({
    where: { key: TEST_DRIVE_SCHEDULE_KEY },
  });

  if (existing) {
    return normalizeTestDriveSchedule(existing.value as Partial<TestDriveSchedule>);
  }

  const defaultSchedule = getDefaultTestDriveSchedule();
  await prisma.setting.create({
    data: {
      key: TEST_DRIVE_SCHEDULE_KEY,
      value: defaultSchedule,
    },
  });

  return defaultSchedule;
}

export async function saveTestDriveSchedule(
  schedule: TestDriveSchedule,
): Promise<TestDriveSchedule> {
  const normalized = normalizeTestDriveSchedule(schedule);

  await prisma.setting.upsert({
    where: { key: TEST_DRIVE_SCHEDULE_KEY },
    create: {
      key: TEST_DRIVE_SCHEDULE_KEY,
      value: normalized,
    },
    update: {
      value: normalized,
    },
  });

  return normalized;
}

export async function getGiveawayDateSetting(): Promise<GiveawayDateSetting> {
  const existing = await prisma.setting.findUnique({
    where: { key: GIVEAWAY_DATE_KEY },
  });

  if (existing) {
    return normalizeGiveawayDateSetting(
      existing.value as Partial<GiveawayDateSetting>,
    );
  }

  const defaultSetting = getDefaultGiveawayDate();
  await prisma.setting.create({
    data: {
      key: GIVEAWAY_DATE_KEY,
      value: defaultSetting,
    },
  });

  return defaultSetting;
}

export async function saveGiveawayDateSetting(
  setting: GiveawayDateSetting,
): Promise<GiveawayDateSetting> {
  const normalized = normalizeGiveawayDateSetting(setting);

  await prisma.setting.upsert({
    where: { key: GIVEAWAY_DATE_KEY },
    create: {
      key: GIVEAWAY_DATE_KEY,
      value: normalized,
    },
    update: {
      value: normalized,
    },
  });

  return normalized;
}

export async function getGiveawayDateLabel() {
  const { date } = await getGiveawayDateSetting();
  return formatTestDriveDate(date);
}

export async function getTestDrivePeriodLabel() {
  const schedule = await getTestDriveSchedule();
  return formatTestDrivePeriodLabel(schedule.dateFrom, schedule.dateTo);
}
