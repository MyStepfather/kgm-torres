import Image from "next/image";
import { SectionLabel } from "@/components/landing/SectionLabel";
import { PRIZES } from "@/lib/constants";
import { LANDING_IMAGES } from "@/lib/landing-assets";

const prizeImages = {
  prize1: LANDING_IMAGES.prize1,
  prize2: LANDING_IMAGES.prize2,
  prize3: LANDING_IMAGES.prize3,
} as const;

const placeLabels: Record<number, string> = {
  1: "1 место",
  2: "2 место",
  3: "3 место",
};

export function Prizes() {
  return (
    <section id="prizes" className="py-10 lg:py-16">
      <div className="section-container">
        <div className="overflow-hidden rounded-[60px] bg-brand-tint px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="max-w-4xl">
            <SectionLabel>Розыгрыш Champion</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-brand sm:text-4xl lg:text-[54px] lg:leading-[1.1]">
              Три победителя, выбранные по итогу акции случайным образом!
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {PRIZES.map((prize) => {
              const featured = prize.place === 1;

              return (
                <article
                  key={prize.place}
                  className={`overflow-hidden rounded-[40px] border ${
                    featured
                      ? "border-accent-light/30 bg-brand"
                      : "border-white/40 bg-white/30"
                  }`}
                >
                  <div className="relative h-[260px] overflow-hidden rounded-[40px] bg-surface">
                    <Image
                      src={prizeImages[prize.imageKey]}
                      alt={prize.title}
                      fill
                      className="object-contain object-center p-6"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <span className="brand-badge absolute left-5 top-5">
                      {placeLabels[prize.place]}
                    </span>
                  </div>

                  <div className="space-y-4 p-8">
                    <h3
                      className={`text-2xl font-bold ${
                        featured ? "text-white" : "text-brand"
                      }`}
                    >
                      {prize.title}
                    </h3>

                    <ul className="space-y-2">
                      {prize.specs.map((spec) => (
                        <li
                          key={spec}
                          className={`flex items-center gap-3 text-lg ${
                            featured ? "text-white/50" : "text-brand/50"
                          }`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${
                              featured ? "bg-white" : "bg-brand"
                            }`}
                          />
                          {spec}
                        </li>
                      ))}
                    </ul>

                    <span
                      className={`inline-flex rounded-full px-5 py-1.5 text-sm font-bold uppercase tracking-[0.08em] ${
                        featured
                          ? "bg-white/10 text-white"
                          : "bg-brand/10 text-brand"
                      }`}
                    >
                      {prize.model}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
