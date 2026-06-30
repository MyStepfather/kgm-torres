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
  badge?: string;
};

function StepCard({
  step,
  title,
  description,
  showNumber = true,
  wide = false,
  qrImage = false,
  badge,
}: StepCardProps) {
  if (wide && qrImage) {
    return (
      <article className="relative overflow-hidden rounded-[20px] border border-border bg-surface p-8 sm:min-h-[378px] sm:rounded-[40px] md:col-span-2">
        <div className="flex flex-col gap-4 sm:min-h-[280px] sm:flex-row sm:items-stretch sm:justify-between sm:gap-10 md:gap-12">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="hidden h-[52px] w-[52px] items-center justify-center rounded-2xl bg-accent-icon sm:flex">
              <StepIcon type={stepIcons[step]} />
            </div>

            <div className="sm:mt-auto sm:pt-20">
              {badge && (
                <span className="mb-4 inline-flex rounded-full bg-brand px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
                  {badge}
                </span>
              )}
              <h3 className="text-2xl font-semibold text-brand">{title}</h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>

          <div className="relative hidden h-[220px] w-[180px] shrink-0 self-end sm:block md:h-[280px] md:w-[240px]">
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
      className={`relative overflow-hidden rounded-[20px] border border-border bg-surface p-8 sm:rounded-[40px] ${
        wide ? "md:col-span-2" : "sm:min-h-[378px]"
      }`}
    >
      {showNumber && <StepNumber value={step} />}

      <div
        className={
          wide
            ? "grid h-full gap-6 md:grid-cols-[1fr_auto] md:items-stretch"
            : "flex flex-col gap-4 sm:min-h-[300px] sm:flex-col"
        }
      >
        <div className={wide ? "flex flex-col justify-end pb-2" : "flex flex-col sm:flex-1"}>
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-accent-icon">
            <StepIcon type={stepIcons[step]} />
          </div>

          <div className={wide ? "mt-8" : "mt-8 sm:mt-auto sm:pt-20"}>
            {badge && (
              <span className="mb-4 inline-flex rounded-full bg-brand px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
                {badge}
              </span>
            )}
            <h3 className="text-2xl font-semibold text-brand">{title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>

        {qrImage && (
          <div className="relative mx-auto h-[220px] w-[220px] shrink-0 md:mx-0 md:hidden">
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

export function HowToParticipate({
  testDrivePeriodLabel,
}: {
  testDrivePeriodLabel: string;
}) {
  const featured = STEPS.find((step) => step.variant === "featured")!;
  const step1 = STEPS.find((step) => step.step === 1)!;
  const step2 = STEPS.find((step) => step.step === 2)!;
  const step3 = STEPS.find((step) => step.variant === "wide")!;

  return (
    <section id="how" className="pb-10 md:pb-16">
      <div className="section-container space-y-8">
        <div className="max-w-2xl">
          <SectionLabel>Как участвовать</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold leading-tight text-brand sm:text-4xl md:text-[54px] md:leading-[1.1]">
            Три шага до приза
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:grid-rows-[auto_auto]">
          <article className="relative flex flex-col overflow-hidden rounded-[20px] bg-brand sm:rounded-[40px] md:row-span-2">
            <div className="relative mx-4 mt-4 h-[240px] overflow-hidden rounded-[16px] sm:h-[300px] sm:rounded-[32px] md:mx-5 md:mt-5 md:h-[374px]">
              <Image
                src={LANDING_IMAGES.howToParticipate}
                alt="Садовая техника Champion"
                fill
                className="object-cover object-[80%_center] sm:object-[90%_center] sm:scale-[1.1] md:object-[78%_center] md:scale-100 lg:object-[100%_center] lg:scale-[1.3]"
                sizes="(max-width: 60rem) 100vw, 33vw"
              />
            </div>

            <div className="flex flex-1 flex-col p-5 pt-6 md:p-8 md:pt-7">
              <h3 className="text-2xl font-semibold text-white">
                {featured.title}
              </h3>
              <p className="mt-4 flex-1 text-lg leading-relaxed text-white/70">
                {featured.description}
              </p>

              <div className="mt-8">
                <ArrowButton href="#register" variant="white">
                  <span className="min-[451px]:hidden">Записаться</span>
                  <span className="hidden min-[451px]:inline">Записаться на тест-драйв</span>
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
            badge={`${testDrivePeriodLabel}`}
          />
        </div>
      </div>
    </section>
  );
}
