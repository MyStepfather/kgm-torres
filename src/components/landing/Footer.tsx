import Image from "next/image";
import Link from "next/link";
import { LANDING_IMAGES } from "@/lib/landing-assets";

export function Footer() {
  return (
    <footer className="bg-brand-soft py-12 text-white lg:py-16">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-6">
              <Image
                src={LANDING_IMAGES.logoKgmWhite}
                alt="KGM"
                width={252}
                height={54}
                className="h-8 w-auto"
              />
              <Image
                src={LANDING_IMAGES.logoChampionWhite}
                alt="Champion"
                width={332}
                height={116}
                className="h-7 w-auto"
              />
            </div>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Официальная акция KGM Torres. Пройдите тест-драйв и участвуйте в
              розыгрыше садовой техники Champion.
            </p>
          </div>

          <div>
            <h3 className="descriptor text-white/80">Документы</h3>
            <ul className="mt-5 space-y-3 text-base">
              <li>
                <Link href="#" className="text-white/60 transition hover:text-white">
                  Полные правила акции
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 transition hover:text-white">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 transition hover:text-white">
                  Условия участия в розыгрыше
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="descriptor text-white/80">Контакты</h3>
            <ul className="mt-5 space-y-3 text-base">
              <li>
                <a
                  href="tel:88000000000"
                  className="text-white/60 transition hover:text-white"
                >
                  8 800 000 00 00
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@kgm-promo.ru"
                  className="text-white/60 transition hover:text-white"
                >
                  support@kgm-promo.ru
                </a>
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              {["VK", "TG", "YT"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white transition hover:bg-white hover:text-brand"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © {new Date().getFullYear()} KGM Torres × Champion. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
