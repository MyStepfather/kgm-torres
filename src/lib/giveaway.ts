import { parseIsoDate, startOfDay } from "@/lib/dates";

export function isGiveawayAvailable(giveawayDateIso: string) {
  const giveawayDate = parseIsoDate(giveawayDateIso);
  if (!giveawayDate) {
    return false;
  }

  return startOfDay(new Date()) >= giveawayDate;
}
