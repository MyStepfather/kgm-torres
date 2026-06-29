import { CountdownTimer } from "@/components/landing/CountdownTimer";
import { SectionLabel } from "@/components/landing/SectionLabel";

type GiveawayCountdownProps = {
  giveawayDateLabel: string;
  countdownTarget: string;
};

export function GiveawayCountdown({
  giveawayDateLabel,
  countdownTarget,
}: GiveawayCountdownProps) {
  return (
    <section id="giveaway" className="pb-10 md:pb-16">
      <div className="section-container-wide">
        <div className="overflow-hidden rounded-[30px] bg-brand px-5 py-8 sm:rounded-[45px] sm:px-11 sm:py-14 md:rounded-[60px] md:px-[60px] md:py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between md:gap-8">
            <div>
              <SectionLabel variant="inverse">Розыгрыш</SectionLabel>
              <h2 className="mt-4 text-lg font-semibold leading-tight text-white sm:mt-5 sm:text-[28px] md:text-[40px] lg:text-[54px] lg:leading-[1.1]">
                До подведения
                <br />
                итогов
              </h2>
            </div>

            <div className="sm:text-right">
              <p className="descriptor text-white/70">Дата розыгрыша</p>
              <p className="mt-2 text-sm font-medium text-white sm:mt-4 sm:text-lg md:text-[25px]">
                {giveawayDateLabel}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[14px] bg-brand-soft px-3 py-3 sm:mt-12 sm:rounded-[22px] sm:px-5 sm:py-5 md:mt-16 md:rounded-[30px] md:px-6 md:py-8">
            <CountdownTimer targetIso={countdownTarget} />
            <p className="mt-4 text-center text-[8px] uppercase tracking-[0.08em] text-white/30 sm:mt-6 sm:text-[9px] md:text-xs">
              Обратный отсчет до подведения итогов акции
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
