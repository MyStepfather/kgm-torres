import Image from "next/image";
import { ArrowButton } from "@/components/landing/ArrowButton";
import { SectionLabel } from "@/components/landing/SectionLabel";
import { STEPS } from "@/lib/constants";
import { LANDING_IMAGES } from "@/lib/landing-assets";

function StepIcon({ type }: { type: "form" | "qr" | "dealer" }) {
  if (type === "form") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "qr") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h2v2h-2zM18 14h3v3h-3zM14 18h2v3h-2zM18 18h1v1h-1zM20 18h1v1h-1zM20 20h1v1h-1z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 21h18M5 21V9l7-5 7 5v12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10h.01M15 10h.01" strokeLinecap="round" />
    </svg>
  );
}

const stepIcons: Record<number, "form" | "qr" | "dealer"> = {
  1: "form",
  2: "qr",
  3: "dealer",
};

function StepNumber({ value }: { value: number }) {
  return (
    <span className="pointer-events-none absolute right-5 top-0 select-none text-[120px] font-bold leading-none text-brand/10">
      {value}
    </span>
  );
}

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  showNumber?: boolean;
  wide?: boolean;
  qrImage?: boolean;
};

function StepCard({
  step,
  title,
  description,
  showNumber = true,
  wide = false,
  qrImage = false,
}: StepCardProps) {
  if (wide && qrImage) {
    return (
      <article className="relative min-h-[378px] overflow-hidden rounded-[40px] border border-border bg-surface p-8 lg:col-span-2">
        <div className="flex h-full min-h-[280px] flex-row items-stretch justify-between gap-8 sm:gap-10 lg:gap-12">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-accent-icon">
              <StepIcon type={stepIcons[step]} />
            </div>

            <div className="mt-auto pt-20">
              <h3 className="text-2xl font-semibold text-brand">{title}</h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {description}
              </p>
            </div>
          </div>

          <div className="relative h-[180px] w-[140px] shrink-0 self-end sm:h-[220px] sm:w-[180px] lg:h-[280px] lg:w-[240px]">
            <Image
              src={LANDING_IMAGES.qrDemo}
              alt="QR-код участника"
              fill
              className="object-contain object-right"
              sizes="240px"
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`relative overflow-hidden rounded-[40px] border border-border bg-surface p-8 ${
        wide ? "lg:col-span-2" : "min-h-[378px]"
      }`}
    >
      {showNumber && <StepNumber value={step} />}

      <div
        className={
          wide
            ? "grid h-full gap-6 lg:grid-cols-[1fr_auto] lg:items-stretch"
            : "flex h-full min-h-[300px] flex-col"
        }
      >
        <div className={wide ? "flex flex-col justify-end pb-2" : "flex flex-1 flex-col"}>
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-accent-icon">
            <StepIcon type={stepIcons[step]} />
          </div>

          <div className={wide ? "mt-8" : "mt-auto pt-20"}>
            <h3 className="text-2xl font-semibold text-brand">{title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
          </div>
        </div>

        {qrImage && (
          <div className="relative mx-auto h-[220px] w-[220px] shrink-0 lg:mx-0 lg:hidden">
            <Image
              src={LANDING_IMAGES.qrDemo}
              alt="QR-код участника"
              fill
              className="object-contain"
              sizes="220px"
            />
          </div>
        )}
      </div>
    </article>
  );
}

export function HowToParticipate() {
  const featured = STEPS.find((step) => step.variant === "featured")!;
  const step1 = STEPS.find((step) => step.step === 1)!;
  const step2 = STEPS.find((step) => step.step === 2)!;
  const step3 = STEPS.find((step) => step.variant === "wide")!;

  return (
    <section id="how" className="pb-10 lg:pb-16">
      <div className="section-container space-y-8">
        <div className="max-w-2xl">
          <SectionLabel>Как участвовать</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold leading-tight text-brand sm:text-4xl lg:text-[54px] lg:leading-[1.1]">
            Три шага до приза
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          <article className="relative flex flex-col overflow-hidden rounded-[40px] bg-brand lg:row-span-2">
            <div className="relative mx-4 mt-4 h-[240px] overflow-hidden rounded-[32px] sm:h-[300px] lg:mx-5 lg:mt-5 lg:h-[374px]">
              <Image
                src={LANDING_IMAGES.howToParticipate}
                alt="Садовая техника Champion"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>

            <div className="flex flex-1 flex-col p-5 pt-6 lg:p-8 lg:pt-7">
              <div className="flex rounded-full border border-white/20 bg-white p-1">
                <span className="flex-1 rounded-full bg-brand px-4 py-2.5 text-center text-sm font-medium text-white">
                  Форма
                </span>
                <span className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-brand">
                  QR-код
                </span>
              </div>

              <h3 className="mt-8 text-2xl font-semibold text-white">
                {featured.title}
              </h3>
              <p className="mt-4 flex-1 text-lg leading-relaxed text-white/70">
                {featured.description}
              </p>

              <div className="mt-8">
                <ArrowButton href="#register" variant="white">
                  Записаться на тест-драйв
                </ArrowButton>
              </div>
            </div>
          </article>

          <StepCard
            step={step1.step}
            title={step1.title}
            description={step1.description}
          />

          <StepCard
            step={step2.step}
            title={step2.title}
            description={step2.description}
          />

          <StepCard
            step={step3.step}
            title={step3.title}
            description={step3.description}
            showNumber={false}
            wide
            qrImage
          />
        </div>
      </div>
    </section>
  );
}
