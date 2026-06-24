import { NextResponse } from "next/server";
import { getTestDriveSchedule } from "@/lib/settings";

export async function GET() {
  const schedule = await getTestDriveSchedule();
  return NextResponse.json(schedule);
}
