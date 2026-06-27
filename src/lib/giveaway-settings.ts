import {
  parseIsoDate,
  startOfDay,
  TEST_DRIVE_MAX_DATE,
  toIsoDate,
} from "@/lib/dates";

export const GIVEAWAY_DATE_KEY = "giveaway_date";

export type GiveawayDateSetting = {
  date: string;
};

export function getDefaultGiveawayDate(): GiveawayDateSetting {
  return {
    date: toIsoDate(startOfDay(TEST_DRIVE_MAX_DATE)),
  };
}

export function normalizeGiveawayDateSetting(
  input: Partial<GiveawayDateSetting> | null | undefined,
): GiveawayDateSetting {
  const defaults = getDefaultGiveawayDate();
  const date = input?.date?.slice(0, 10) ?? defaults.date;

  if (!parseIsoDate(date)) {
    return defaults;
  }

  return { date };
}

export function validateGiveawayDateSetting(
  setting: GiveawayDateSetting,
): string | null {
  if (!parseIsoDate(setting.date)) {
    return "Укажите корректную дату розыгрыша";
  }

  return null;
}
