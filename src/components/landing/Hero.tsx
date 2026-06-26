import Image from "next/image";
import { ArrowButton } from "@/components/landing/ArrowButton";
import { LANDING_IMAGES } from "@/lib/landing-assets";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden rounded-b-[80px]">
      <Image
        src={LANDING_IMAGES.heroBg}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="section-container relative z-10 flex min-h-screen flex-col justify-between pb-10 pt-28 lg:pb-16">
        <div className="max-w-3xl pt-16 lg:pt-24">
          <div className="inline-flex rounded-full border border-[rgba(76,30,126,0.5)] bg-[rgba(76,30,126,0.7)] px-5 py-2 backdrop-blur-sm">
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

        <div className="ml-auto w-full max-w-[385px] rounded-[50px] border border-white/30 bg-surface p-4">
          <div className="relative overflow-hidden rounded-[40px]">
            <Image
              src={LANDING_IMAGES.heroTestDrive}
              alt="KGM Torres"
              width={355}
              height={191}
              className="h-[191px] w-full object-cover"
            />
            <span className="brand-badge absolute left-5 top-5">KGM Torres</span>
          </div>

          <div className="px-2 py-5">
            <h2 className="text-[26px] font-bold leading-tight text-brand">
              ТЕСТ-ДРАЙВ
            </h2>
            <p className="mt-3 text-lg leading-snug text-brand">
              Пройдите тест-драйв KGM Torres и выиграйте садовую технику Champion
            </p>
            <div className="mt-6">
              <ArrowButton href="#register">Записаться на тест-драйв</ArrowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
