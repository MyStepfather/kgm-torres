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
    <section id="prizes" className="pb-10 lg:pb-16">
      <div className="section-container-wide">
        <div className="overflow-hidden rounded-[60px] bg-brand-tint px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div>
            <SectionLabel>Розыгрыш Champion</SectionLabel>
            <h2 className="mt-5 w-full max-w-[980px] text-3xl font-semibold leading-tight text-brand sm:text-4xl lg:text-[54px] lg:leading-[1.1]">
              <span className="block">Три победителя, выбранные по</span>
              <span className="block">итогу акции случайным образом!</span>
            </h2>
          </div>

          <div className="mt-16 grid items-stretch gap-5 sm:mt-20 lg:mt-28 lg:grid-cols-3">
            {PRIZES.map((prize) => {
              const featured = prize.place === 1;

              return (
                <article
                  key={prize.place}
                  className={`flex flex-col overflow-hidden rounded-[40px] border ${
                    featured
                      ? "border-accent-light/30 bg-brand"
                      : "border-white/40 bg-white/30"
                  }`}
                >
                  <div className="relative -mx-px -mt-px h-[260px] w-[calc(100%+2px)] shrink-0 overflow-hidden rounded-[40px] bg-white">
                    <Image
                      src={prizeImages[prize.imageKey]}
                      alt={prize.title}
                      fill
                      className="origin-right scale-[1.2] object-contain object-right sm:scale-[1.28] lg:scale-[1.35]"
                      sizes="(max-width: 1024px) 100vw, 620px"
                    />
                    <span className="brand-badge absolute left-5 top-5">
                      {placeLabels[prize.place]}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <h3
                      className={`mb-2 text-2xl font-bold ${
                        featured ? "text-white" : "text-brand"
                      }`}
                    >
                      {prize.title}
                    </h3>

                    <ul className="flex-1 space-y-2">
                      {prize.specs.map((spec) => (
                        <li
                          key={spec}
                          className={`flex items-center gap-3 text-lg ${
                            featured ? "text-white/50" : "text-brand/50"
                          }`}
                        >
                          <span
                            className={`h-1 w-1 shrink-0 rounded-full ${
                              featured ? "bg-white" : "bg-brand"
                            }`}
                          />
                          {spec}
                        </li>
                      ))}
                    </ul>

                    <span
                      className={`mt-8 inline-flex w-fit rounded-full px-5 py-1.5 text-sm font-bold uppercase tracking-[0.08em] ${
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
