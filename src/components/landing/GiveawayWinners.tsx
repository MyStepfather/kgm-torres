import { SectionLabel } from "@/components/landing/SectionLabel";
import type { PublicGiveawayWinner } from "@/lib/giveaway-public";

const placeLabels: Record<number, string> = {
  1: "1 место",
  2: "2 место",
  3: "3 место",
};

type GiveawayWinnersProps = {
  giveawayDateLabel: string;
  winners: PublicGiveawayWinner[];
};

function WinnerCard({
  place,
  phoneMasked,
}: {
  place: number;
  phoneMasked: string;
}) {
  return (
    <article className="flex min-w-0 flex-1 flex-col rounded-[7px] bg-white px-4 py-3 sm:rounded-[14px] sm:px-5 sm:py-4 md:rounded-[20px] md:px-[47px] md:py-[35px]">
      <p className="text-center text-[5px] font-medium uppercase tracking-[0.08em] text-brand/70 sm:text-[10px] md:text-sm">
        {placeLabels[place]}
      </p>
      <p className="mt-1 text-center text-sm font-bold text-brand sm:mt-2 sm:text-xl md:mt-5 md:text-[36px] md:leading-tight">
        {phoneMasked}
      </p>
    </article>
  );
}

export function GiveawayWinners({
  giveawayDateLabel,
  winners,
}: GiveawayWinnersProps) {
  return (
    <section id="giveaway" className="pb-10 md:pb-16">
      <div className="section-container-wide">
        <div className="overflow-hidden rounded-[30px] bg-brand px-5 py-8 sm:rounded-[45px] sm:px-11 sm:py-14 md:rounded-[60px] md:px-[60px] md:py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between md:gap-8">
            <div>
              <SectionLabel variant="inverse">Розыгрыш завершён</SectionLabel>
              <h2 className="mt-4 text-lg font-semibold leading-tight text-white sm:mt-5 sm:text-[28px] md:text-[40px] lg:text-[54px] lg:leading-[1.1]">
                Победители акции
              </h2>
            </div>

            <div className="sm:text-right">
              <p className="descriptor text-white/70">Дата розыгрыша</p>
              <p className="mt-2 text-sm font-medium text-white sm:mt-4 sm:text-lg md:text-[25px]">
                {giveawayDateLabel}
              </p>
            </div>
          </div>

          <div className="relative mt-8 rounded-[14px] bg-background px-3 py-3 sm:mt-12 sm:rounded-[24px] sm:px-5 sm:py-5 md:mt-16 md:rounded-[40px] md:px-8 md:py-8">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-4 md:gap-5">
              {winners.map((winner) => (
                <WinnerCard
                  key={winner.place}
                  place={winner.place}
                  phoneMasked={winner.phoneMasked}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-[8px] uppercase tracking-[0.08em] text-brand/30 sm:mt-6 sm:text-[10px] md:text-xs">
              Победители уже получили уведомления на почту
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
