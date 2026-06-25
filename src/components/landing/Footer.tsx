import Image from "next/image";
import Link from "next/link";
import { LANDING_IMAGES } from "@/lib/landing-assets";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 lg:py-16">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src={LANDING_IMAGES.logoKgm}
                alt="KGM"
                width={146}
                height={33}
                className="h-8 w-auto"
              />
              <Image
                src={LANDING_IMAGES.logoChampion}
                alt="Champion"
                width={174}
                height={29}
                className="h-7 w-auto"
              />
            </div>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Официальная акция KGM Torres. Пройдите тест-драйв и участвуйте в
              розыгрыше садовой техники Champion.
            </p>
          </div>

          <div>
            <h3 className="descriptor text-brand">Документы</h3>
            <ul className="mt-5 space-y-3 text-base text-muted">
              <li>
                <Link href="#" className="transition hover:text-brand">
                  Полные правила акции
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-brand">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-brand">
                  Условия участия в розыгрыше
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="descriptor text-brand">Контакты</h3>
            <ul className="mt-5 space-y-3 text-base text-muted">
              <li>
                <a href="tel:88000000000" className="transition hover:text-brand">
                  8 800 000 00 00
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@kgm-promo.ru"
                  className="transition hover:text-brand"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} KGM Torres × Champion. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
