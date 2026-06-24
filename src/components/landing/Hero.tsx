import { GIVEAWAY_DATE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,162,74,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(26,58,47,0.5),transparent_35%),linear-gradient(180deg,#0b0f14_0%,#121820_55%,#0b0f14_100%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="section-container relative z-10 py-20">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-widest text-muted">
            Партнёрство KGM × Champion
          </span>
          <span className="rounded-full bg-accent/15 px-4 py-1 text-xs font-semibold text-accent">
            Розыгрыш {GIVEAWAY_DATE}
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Почувствуй дух приключений. Пройдите тест-драйв{" "}
          <span className="text-accent">KGM Torres</span> и выиграйте садовую
          технику Champion
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted">
          Розыгрыш 3 призов. Дата проведения розыгрыша — {GIVEAWAY_DATE}.
          Запишитесь на тест-драйв, получите QR-код и участвуйте в акции.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#register" className="btn-primary">
            Записаться на тест-драйв / участвовать в розыгрыше
          </a>
          <a href="#how" className="btn-secondary">
            Как это работает
          </a>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Призовых мест", value: "3" },
            { label: "Шагов до участия", value: "3" },
            { label: "Мощность Torres", value: "163 л.с." },
          ].map((item) => (
            <div key={item.label} className="card-surface p-5">
              <div className="text-2xl font-bold text-accent">{item.value}</div>
              <div className="mt-1 text-sm text-muted">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
