"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LANDING_IMAGES } from "@/lib/landing-assets";

const navLinks = [
  { href: "#about", label: "О KGM Torres" },
  { href: "#prizes", label: "Призы розыгрыша" },
  { href: "#how", label: "Как участвовать" },
];

const SCROLL_THRESHOLD = 56;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent pt-4 transition-all duration-300 ease-in-out">
      <div className="section-container">
        <div
          className={`grid h-[70px] grid-cols-[auto_1fr_auto] items-center px-3 transition-all duration-300 ease-in-out lg:grid-cols-[1fr_auto_1fr] ${
            scrolled ? "rounded-full bg-black" : ""
          }`}
        >
        <div className="relative flex h-[52px] shrink-0 items-center justify-self-start">
          <div
            aria-hidden
            className={`absolute inset-0 rounded-full bg-black/30 backdrop-blur-md transition-all duration-300 ease-in-out ${
              scrolled ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          />

          <div className="relative flex h-full items-center gap-6 px-8 sm:gap-8 sm:px-10">
            <Image
              src={LANDING_IMAGES.logoKgmWhite}
              alt="KGM"
              width={252}
              height={54}
              className="h-[26px] w-auto sm:h-[28px]"
              priority
            />
            <Image
              src={LANDING_IMAGES.logoChampionWhite}
              alt="Champion"
              width={332}
              height={116}
              className="h-[26px] w-auto sm:h-[28px]"
              priority
            />
          </div>
        </div>

        <nav className="hidden items-center justify-self-center gap-8 text-[15px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] lg:flex xl:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 ease-in-out hover:text-white/75"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="#register"
          className="inline-flex h-[52px] shrink-0 items-center justify-center justify-self-end rounded-full bg-surface px-6 text-base font-semibold text-brand transition hover:bg-white sm:px-8 sm:text-[17px]"
        >
          Регистрация
        </Link>
        </div>
      </div>
    </header>
  );
}
