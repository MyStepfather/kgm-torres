import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/60 py-12">
      <div className="section-container">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-sm font-bold text-accent">
                KGM
              </div>
              <div className="rounded-lg border border-accent/30 px-3 py-1 text-xs font-semibold text-accent">
                CHAMPION
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Официальная акция KGM Torres. Пройдите тест-драйв и участвуйте в
              розыгрыше садовой техники Champion.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Документы</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>
                  <Link href="#" className="hover:text-white">
                    Полные правила акции
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Политика конфиденциальности
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Контакты</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>
                  <a href="tel:+78001234567" className="hover:text-white">
                    8 800 123-45-67
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@kgm-torres.ru"
                    className="hover:text-white"
                  >
                    support@kgm-torres.ru
                  </a>
                </li>
              </ul>
              <h3 className="mt-6 text-sm font-semibold">Соцсети</h3>
              <ul className="mt-3 flex gap-4 text-sm text-muted">
                <li>
                  <a href="#" className="hover:text-white">
                    VK
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} KGM Torres × Champion. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
