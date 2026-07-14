import Image from "next/image";
import { SectionLabel } from "@/components/landing/SectionLabel";
import { PRIZES } from "@/lib/constants";
import { LANDING_IMAGES } from "@/lib/landing-assets";
import "./Prizes.css";

const prizeImages = {
  prize1: LANDING_IMAGES.prize1,
  prize2: LANDING_IMAGES.prize2,
  prize3: LANDING_IMAGES.prize3,
} as const;

const prizeImageClasses: Record<
  (typeof PRIZES)[number]["imageKey"],
  string
> = {
  prize1: "prize-image-1 object-contain object-right",
  prize2: "prize-image-2 object-contain object-right",
  prize3: "prize-image-3 object-contain object-right",
};

const placeLabels: Record<number, string> = {
  1: "1 место",
  2: "2 место",
  3: "3 место",
};

export function Prizes() {
  return (
    <section id="prizes" className="pb-10 md:pb-16">
      <div className="section-container-wide">
        <div className="overflow-hidden rounded-[32px] bg-brand-tint px-6 py-12 sm:rounded-[60px] sm:px-10 md:px-14 md:py-16">
          <div>
            <SectionLabel>призы розыгрыша</SectionLabel>
            <h2 className="mt-5 w-full max-w-[980px] text-3xl font-semibold leading-tight text-brand sm:text-4xl md:text-[54px] md:leading-[1.1]">
              Три победителя, выбранные по итогу акции случайным образом!
            </h2>
          </div>

          <div className="mt-12 grid items-stretch gap-5 sm:mt-16 sm:grid-cols-3 md:mt-28">
            {PRIZES.map((prize) => {
              const featured = prize.place === 1;

              return (
                <article
                  key={prize.place}
                  className={`flex flex-col overflow-hidden rounded-[20px] border sm:rounded-[40px] ${
                    featured
                      ? "border-accent-light/30 bg-brand"
                      : "border-white/40 bg-white/30"
                  }`}
                >
                  <div className="relative -mx-px -mt-px h-[260px] w-[calc(100%+2px)] shrink-0 overflow-hidden rounded-[20px] bg-white sm:rounded-[40px] md:h-[388px]">
                    <Image
                      src={prizeImages[prize.imageKey]}
                      alt={prize.title}
                      fill
                      className={prizeImageClasses[prize.imageKey]}
                      sizes="(max-width: 60rem) 100vw, 620px"
                    />
                    <span className="brand-badge absolute left-5 top-5">
                      {placeLabels[prize.place]}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3
                      className={`mb-2 text-xl font-bold md:text-2xl ${
                        featured ? "text-white" : "text-brand"
                      }`}
                    >
                      {prize.title}
                    </h3>

                    <ul className="flex-1 space-y-2">
                      {prize.specs.map((spec) => (
                        <li
                          key={spec}
                          className={`flex items-center gap-3 text-base md:text-lg ${
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
