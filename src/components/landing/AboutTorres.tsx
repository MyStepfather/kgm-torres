import { TORRES_SPECS } from "@/lib/constants";

export function AboutTorres() {
  return (
    <section id="about" className="py-24">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              О KGM Torres
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Внедорожник для города и бездорожья
            </h2>
            <p className="mt-4 text-muted">
              KGM Torres сочетает уверенную динамику, полный привод и комфорт
              для дальних поездок. Идеальный повод испытать автомобиль в деле —
              на тест-драйве у официального дилера.
            </p>
            <a href="#register" className="btn-primary mt-8">
              Записаться на тест-драйв
            </a>
          </div>

          <div className="grid gap-4">
            <div className="card-surface aspect-[16/10] overflow-hidden">
              <div className="flex h-full items-end bg-gradient-to-br from-brand via-slate-800 to-slate-900 p-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent">
                    Экстерьер
                  </p>
                  <p className="text-lg font-semibold">KGM Torres</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-surface aspect-square bg-gradient-to-br from-slate-800 to-slate-900 p-4">
                <p className="text-xs text-muted">Интерьер</p>
                <p className="mt-2 font-semibold">Комфорт и технологии</p>
              </div>
              <div className="card-surface aspect-square bg-gradient-to-br from-brand to-slate-900 p-4">
                <p className="text-xs text-muted">Динамика</p>
                <p className="mt-2 font-semibold">Полный привод 4WD</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TORRES_SPECS.map((spec) => (
            <div key={spec.label} className="card-surface p-6 text-center">
              <div className="text-3xl font-bold text-accent">
                {spec.value}
                <span className="ml-1 text-base font-medium text-white">
                  {spec.unit}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted">{spec.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
