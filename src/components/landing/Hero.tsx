import Image from "next/image";
import { ArrowButton } from "@/components/landing/ArrowButton";
import { LANDING_IMAGES } from "@/lib/landing-assets";

export function Hero() {
  return (
    <section className="hero-section relative overflow-hidden rounded-b-[80px]">
      <div className="absolute inset-0 overflow-hidden rounded-b-[80px]">
        <Image
          src={LANDING_IMAGES.heroBg}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* <HeroBackgroundMedia posterSrc={LANDING_IMAGES.heroBg} /> */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/25"
        />
      </div>

      <div className="section-container relative z-10 grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-4 pb-8 pt-28 sm:gap-6 sm:pb-10 lg:pb-12 lg:pt-28">
        <div className="flex min-h-0 flex-col items-start justify-start pt-6 sm:pt-10 lg:pt-16">
          <div className="w-fit rounded-full border border-[rgba(76,30,126,0.5)] bg-[rgba(76,30,126,0.7)] px-5 py-2 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-white">
                <span className="h-1.5 w-1.5 rounded-sm bg-accent" />
                Дата проведения
              </span>
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-white">
                <span className="h-1.5 w-1.5 rounded-sm bg-accent" />
                Розыгрыш 3 призов
              </span>
            </div>
          </div>

          <h1 className="mt-5 max-w-2xl text-5xl font-bold leading-none tracking-[-0.02em] text-white sm:text-6xl lg:text-[65px]">
            Почувствуйте
            <br />
            дух приключений
          </h1>
        </div>

        <div className="ml-auto w-full max-w-[385px] shrink-0">
          <div className="rounded-[50px] border border-white/30 bg-surface p-4">
            <div className="relative overflow-hidden rounded-[40px]">
              <Image
                src={LANDING_IMAGES.heroTestDrive}
                alt="KGM Torres"
                width={355}
                height={191}
                className="h-[160px] w-full object-cover sm:h-[191px]"
              />
              <span className="brand-badge absolute left-5 top-5">KGM Torres</span>
            </div>

            <div className="px-2 py-4 sm:py-5">
              <h2 className="text-[26px] font-bold leading-tight text-brand">
                ТЕСТ-ДРАЙВ
              </h2>
              <p className="mt-3 text-base leading-snug text-brand sm:text-lg">
                Пройдите тест-драйв KGM Torres и выиграйте садовую технику Champion
              </p>
              <div className="mt-5 sm:mt-6">
                <ArrowButton href="#register">Записаться на тест-драйв</ArrowButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
