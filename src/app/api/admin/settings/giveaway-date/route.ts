import { NextRequest, NextResponse } from "next/server";
import {
  normalizeGiveawayDateSetting,
  type GiveawayDateSetting,
  validateGiveawayDateSetting,
} from "@/lib/giveaway-settings";
import {
  getGiveawayDateSetting,
  saveGiveawayDateSetting,
} from "@/lib/settings";

export async function GET() {
  const setting = await getGiveawayDateSetting();
  return NextResponse.json(setting);
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<GiveawayDateSetting>;
    const setting = normalizeGiveawayDateSetting(body);
    const validationError = validateGiveawayDateSetting(setting);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const saved = await saveGiveawayDateSetting(setting);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Save giveaway date error:", error);
    return NextResponse.json(
      { error: "Не удалось сохранить дату розыгрыша" },
      { status: 500 },
    );
  }
}
