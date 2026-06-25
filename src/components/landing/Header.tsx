import Image from "next/image";
import Link from "next/link";
import { LANDING_IMAGES } from "@/lib/landing-assets";

const navLinks = [
  { href: "#about", label: "О KGM Torres" },
  { href: "#prizes", label: "Призы розыгрыша" },
  { href: "#how", label: "Как участвовать" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10 xl:px-20">
      <div className="mx-auto flex h-[70px] max-w-[1760px] items-center rounded-full bg-black/95 px-2 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-4 rounded-full bg-white/5 px-5 py-2">
          <Image
            src={LANDING_IMAGES.logoKgm}
            alt="KGM"
            width={126}
            height={27}
            className="h-7 w-auto"
            priority
          />
          <Image
            src={LANDING_IMAGES.logoChampion}
            alt="Champion"
            width={146}
            height={24}
            className="hidden h-6 w-auto sm:block"
            priority
          />
        </div>

        <nav className="mx-auto hidden items-center gap-10 text-[15px] font-medium text-white md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-accent-light">
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="#register"
          className="ml-auto inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-surface px-6 text-[19px] font-semibold text-brand transition hover:bg-white"
        >
          Регистрация
        </Link>
      </div>
    </header>
  );
}
