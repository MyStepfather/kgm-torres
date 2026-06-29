import { formatTestDriveDate, parseIsoDate } from "@/lib/dates";
import { getGiveawayDateSetting } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export type PublicGiveawayWinner = {
  place: number;
  phoneMasked: string;
};

export type PublicGiveawayStatus = {
  giveawayDate: string;
  giveawayDateLabel: string;
  countdownTarget: string;
  winners: PublicGiveawayWinner[] | null;
};

export function maskPhoneSuffix(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const suffix = digits.slice(-4);
  return `······ ${suffix}`;
}

export function getGiveawayCountdownTarget(dateIso: string) {
  const date = parseIsoDate(dateIso);
  if (!date) {
    return new Date().toISOString();
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  ).toISOString();
}

export async function getPublicGiveawayStatus(): Promise<PublicGiveawayStatus> {
  const { date } = await getGiveawayDateSetting();
  const giveawayDateLabel = formatTestDriveDate(date);
  const countdownTarget = getGiveawayCountdownTarget(date);

  const latestRun = await prisma.giveawayRun.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      winners: {
        orderBy: { place: "asc" },
        include: {
          registration: {
            select: { phone: true, phoneNormalized: true },
          },
        },
      },
    },
  });

  const winners =
    latestRun && latestRun.winners.length > 0
      ? latestRun.winners.map((winner) => ({
          place: winner.place,
          phoneMasked: maskPhoneSuffix(
            winner.registration.phoneNormalized ||
              winner.registration.phone,
          ),
        }))
      : null;

  return {
    giveawayDate: date,
    giveawayDateLabel,
    countdownTarget,
    winners,
  };
}
