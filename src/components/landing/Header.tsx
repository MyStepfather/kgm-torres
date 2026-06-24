import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="section-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-sm font-bold tracking-wider text-accent">
            KGM
          </div>
          <span className="hidden text-xs text-muted sm:inline">×</span>
          <div className="hidden rounded-lg border border-accent/30 px-3 py-1 text-xs font-semibold text-accent sm:block">
            CHAMPION
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#about" className="hover:text-white">
            О Torres
          </a>
          <a href="#prizes" className="hover:text-white">
            Призы
          </a>
          <a href="#how" className="hover:text-white">
            Как участвовать
          </a>
        </nav>
        <Link href="#register" className="btn-primary text-xs sm:text-sm">
          Записаться
        </Link>
      </div>
    </header>
  );
}
