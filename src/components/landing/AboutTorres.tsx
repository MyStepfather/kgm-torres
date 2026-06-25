import Image from "next/image";
import { ArrowButton } from "@/components/landing/ArrowButton";
import { TORRES_SPECS } from "@/lib/constants";
import { LANDING_IMAGES } from "@/lib/landing-assets";

function SpecIcon({ type }: { type: (typeof TORRES_SPECS)[number]["icon"] }) {
  const paths: Record<(typeof TORRES_SPECS)[number]["icon"], string> = {
    power: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
    torque: "M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
    transmission: "M8 7h8M8 12h8M8 17h8M5 5v14M19 5v14",
    drive: "M7 17h10M5 12h14M8 7h8v10H8z",
  };

  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={paths[type]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AboutTorres() {
  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="section-container space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[50px] border border-border lg:min-h-[543px]">
            <Image
              src={LANDING_IMAGES.aboutExterior}
              alt="KGM Torres экстерьер"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <span className="brand-badge absolute left-7 top-7">KGM Torres</span>
            <p className="descriptor absolute bottom-6 left-7 text-white/70">
              Экстерьер
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[50px] border border-border bg-brand p-8 lg:min-h-[543px] lg:p-10">
            <div className="pointer-events-none absolute -left-32 -top-32 h-[690px] w-[866px] rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-[295px] w-[304px] rounded-full bg-accent/30 blur-2xl" />

            <h2 className="relative max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[40px]">
              Дизайн, продиктованный движением. Технологии для любых дорог.
            </h2>

            <div className="relative mt-auto pt-16 lg:absolute lg:bottom-10 lg:left-10 lg:pt-0">
              <ArrowButton href="#register" variant="white">
                Записаться на тест-драйв
              </ArrowButton>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {TORRES_SPECS.map((spec) => (
            <div
              key={spec.label}
              className="relative overflow-hidden rounded-[50px] border border-border bg-surface p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-icon">
                <SpecIcon type={spec.icon} />
              </div>
              <p className="mt-8 text-[45px] font-bold leading-none tracking-wide text-brand">
                {spec.value}
              </p>
              <p className="mt-2 text-lg text-muted">{spec.label}</p>
              <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-brand/5" />
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
          <div className="relative min-h-[260px] overflow-hidden rounded-[50px] border border-border lg:min-h-[327px]">
            <Image
              src={LANDING_IMAGES.aboutInterior}
              alt="KGM Torres интерьер"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <span className="brand-badge absolute left-7 top-7">KGM Torres</span>
            <p className="descriptor absolute bottom-6 left-7 text-white/60">
              Интерьер
            </p>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-[50px] border border-border lg:min-h-[327px]">
            <Image
              src={LANDING_IMAGES.aboutMotion}
              alt="KGM Torres динамика"
              fill
              className="object-cover object-[center_30%]"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <span className="brand-badge absolute left-7 top-7">KGM Torres</span>
            <p className="descriptor absolute bottom-6 right-7 text-white/60">
              Динамика
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
