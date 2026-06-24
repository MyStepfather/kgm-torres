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
