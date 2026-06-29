import { GiveawayCountdown } from "@/components/landing/GiveawayCountdown";
import { GiveawayWinners } from "@/components/landing/GiveawayWinners";
import { getPublicGiveawayStatus } from "@/lib/giveaway-public";

export async function GiveawaySection() {
  const status = await getPublicGiveawayStatus();

  if (status.winners?.length) {
    return (
      <GiveawayWinners
        giveawayDateLabel={status.giveawayDateLabel}
        winners={status.winners}
      />
    );
  }

  return (
    <GiveawayCountdown
      giveawayDateLabel={status.giveawayDateLabel}
      countdownTarget={status.countdownTarget}
    />
  );
}
