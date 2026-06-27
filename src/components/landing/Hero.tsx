import Image from "next/image";
import { ArrowButton } from "@/components/landing/ArrowButton";
import { LANDING_IMAGES } from "@/lib/landing-assets";

type HeroProps = {
  testDrivePeriodLabel: string;
};

function HeroTestDriveCard({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className="rounded-[50px] border border-white/30 bg-surface p-4">
      <div
        className={
          stacked
            ? "relative aspect-[355/191] w-full overflow-hidden rounded-[40px]"
            : "relative h-[191px] w-full overflow-hidden rounded-[40px]"
        }
      >
        <Image
          src={LANDING_IMAGES.heroTestDrive}
          alt="KGM Torres"
          fill
          className="object-cover"
          sizes={stacked ? "(max-width: 60rem) 100vw, 385px" : "385px"}
        />
        <span className="brand-badge absolute left-5 top-5">KGM Torres</span>
      </div>

      <div className="px-2 py-4 md:py-5">
        <h2 className="text-[26px] font-bold leading-tight text-brand">
          ТЕСТ-ДРАЙВ
        </h2>
        <p className="mt-3 text-base leading-snug text-brand md:text-lg">
          Пройдите тест-драйв KGM Torres
          <br />
          и выиграйте садовую технику Champion
        </p>
        <div className="mt-5 md:mt-6">
          <ArrowButton href="#register">Записаться на тест-драйв</ArrowButton>
        </div>
      </div>
    </div>
  );
}

export function Hero({ testDrivePeriodLabel }: HeroProps) {
  return (
    <>
      <section className="relative h-svh min-h-svh overflow-hidden rounded-b-[80px]">
        <div className="absolute inset-0 overflow-hidden rounded-b-[80px]">
          <Image
            src={LANDING_IMAGES.heroBg}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/25"
          />
        </div>

        <div className="section-container relative z-10 flex h-full min-h-0 flex-col pb-10 pt-28 sm:grid sm:h-full sm:grid-rows-[minmax(0,1fr)_auto] sm:gap-6 sm:pb-10 md:pb-12 md:pt-28 lg:pt-32">
          <div className="flex min-h-0 flex-col items-start justify-start pt-6 md:pt-8 lg:pt-16">
            <div className="w-fit rounded-full border border-[rgba(76,30,126,0.5)] bg-[rgba(76,30,126,0.7)] px-4 py-1.5 backdrop-blur-sm md:px-5 md:py-2">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white md:text-sm">
                  <span className="h-1.5 w-1.5 rounded-sm bg-accent" />
                  {testDrivePeriodLabel}
                </span>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white md:text-sm">
                  <span className="h-1.5 w-1.5 rounded-sm bg-accent" />
                  Розыгрыш 3 призов
                </span>
              </div>
            </div>

            <h1 className="mt-5 max-w-[685px] text-[20px] font-semibold leading-[1.2] text-white md:text-[30px] lg:text-[40px]">
              Почувствуйте дух приключений.
              <br />
              Пройдите тест-драйв KGM Torres
              <br />
              и выиграйте садовую технику
              <br />
              Champion
            </h1>
          </div>

          <div className="ml-auto hidden w-full max-w-[385px] shrink-0 sm:block">
            <HeroTestDriveCard />
          </div>
        </div>
      </section>

      <div className="section-container w-full pb-5 pt-5 sm:hidden">
        <HeroTestDriveCard stacked />
      </div>
    </>
  );
}
