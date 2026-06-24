import { STEPS } from "@/lib/constants";

export function HowToParticipate() {
  return (
    <section id="how" className="py-24">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Как участвовать
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">3 простых шага</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.step} className="relative">
              {index < STEPS.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-6 translate-x-full bg-white/20 lg:block" />
              )}
              <div className="card-surface h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-slate-900">
                  {step.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
                {step.step === 2 && (
                  <div className="mt-6 flex justify-center">
                    <div className="rounded-xl border border-white/10 bg-white p-3">
                      <div className="grid h-24 w-24 grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-sm ${i % 3 === 0 ? "bg-slate-900" : "bg-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
