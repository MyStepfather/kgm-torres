import { ArrowButton } from "@/components/landing/ArrowButton";
import { SectionLabel } from "@/components/landing/SectionLabel";
import { STEPS } from "@/lib/constants";

function StepNumber({ value }: { value: number }) {
  return (
    <span className="pointer-events-none absolute right-6 top-0 text-[120px] font-bold leading-none text-brand/10">
      {value}
    </span>
  );
}

export function HowToParticipate() {
  const featured = STEPS.find((step) => step.variant === "featured")!;
  const regularSteps = STEPS.filter((step) => step.variant !== "featured");
  const wideStep = STEPS.find((step) => step.variant === "wide")!;

  return (
    <section id="how" className="py-10 lg:py-16">
      <div className="section-container space-y-8">
        <div className="max-w-2xl">
          <SectionLabel>Как участвовать</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold leading-tight text-brand sm:text-4xl lg:text-[54px] lg:leading-[1.1]">
            Три шага до приза
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          <article className="relative overflow-hidden rounded-[40px] border border-border bg-brand p-8 lg:row-span-2">
            <div className="pointer-events-none absolute -left-32 -top-32 h-[690px] w-[866px] rounded-full bg-accent/20 blur-3xl" />
            <StepNumber value={featured.step} />

            <div className="relative mt-8 rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="space-y-3 text-white/80">
                <div className="flex items-center justify-between rounded-full border border-white/20 px-5 py-3">
                  <span>Форма</span>
                  <span className="text-accent-light">QR-код</span>
                </div>
                <div className="rounded-full border border-white/20 px-5 py-3 text-center">
                  Записаться на тест-драйв
                </div>
              </div>
            </div>

            <div className="relative mt-8">
              <h3 className="text-2xl font-semibold text-white">{featured.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                {featured.description}
              </p>
              <div className="mt-8">
                <ArrowButton href="#register">Записаться на тест-драйв</ArrowButton>
              </div>
            </div>
          </article>

          {regularSteps
            .filter((step) => step.variant === "default")
            .map((step) => (
              <article
                key={step.step}
                className="relative overflow-hidden rounded-[40px] border border-border bg-surface p-8"
              >
                <StepNumber value={step.step} />
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-icon">
                  <span className="text-lg font-bold text-brand">{step.step}</span>
                </div>
                <h3 className="text-2xl font-semibold text-brand">{step.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  {step.description}
                </p>
              </article>
            ))}

          <article className="relative overflow-hidden rounded-[40px] border border-border bg-surface p-8 lg:col-span-2">
            <StepNumber value={wideStep.step} />
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-icon">
                  <span className="text-lg font-bold text-brand">{wideStep.step}</span>
                </div>
                <h3 className="text-2xl font-semibold text-brand">{wideStep.title}</h3>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                  {wideStep.description}
                </p>
              </div>

              <div className="mx-auto rounded-[28px] border border-border bg-white p-4">
                <div className="grid h-28 w-28 grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-sm ${
                        index % 3 === 0 ? "bg-brand" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
