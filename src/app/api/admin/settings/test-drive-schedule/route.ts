import { NextRequest, NextResponse } from "next/server";
import {
  getTestDriveSchedule,
  saveTestDriveSchedule,
} from "@/lib/settings";
import {
  normalizeTestDriveSchedule,
  type TestDriveSchedule,
  validateTestDriveScheduleInput,
} from "@/lib/test-drive-schedule";

export async function GET() {
  const schedule = await getTestDriveSchedule();
  return NextResponse.json(schedule);
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<TestDriveSchedule>;
    const schedule = normalizeTestDriveSchedule(body);
    const validationError = validateTestDriveScheduleInput(schedule);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const saved = await saveTestDriveSchedule(schedule);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Save test drive schedule error:", error);
    return NextResponse.json(
      { error: "Не удалось сохранить настройки" },
      { status: 500 },
    );
  }
}
