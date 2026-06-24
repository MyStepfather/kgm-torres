import { PRIZES } from "@/lib/constants";

const placeLabels: Record<number, string> = {
  1: "1-е место",
  2: "2-е место",
  3: "3-е место",
};

export function Prizes() {
  return (
    <section id="prizes" className="bg-card/40 py-24">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Призы розыгрыша
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Садовая техника Champion
          </h2>
          <p className="mt-4 text-muted">
            3 победителя, выбранные по итогу акции случайным образом!
            Гарантированных призов нет — только лучшие!
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRIZES.map((prize) => (
            <article key={prize.place} className="card-surface overflow-hidden">
              <div className="flex h-44 items-end bg-gradient-to-br from-brand to-slate-900 p-6">
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-slate-900">
                  {placeLabels[prize.place]}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{prize.title}</h3>
                <p className="mt-1 text-accent">{prize.model}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {prize.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
