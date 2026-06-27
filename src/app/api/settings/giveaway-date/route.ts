import { NextResponse } from "next/server";
import { formatTestDriveDate } from "@/lib/dates";
import { getGiveawayDateSetting } from "@/lib/settings";

export async function GET() {
  const setting = await getGiveawayDateSetting();
  return NextResponse.json({
    ...setting,
    label: formatTestDriveDate(setting.date),
  });
}
