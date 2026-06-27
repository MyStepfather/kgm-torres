"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LANDING_IMAGES } from "@/lib/landing-assets";

const navLinks = [
  { href: "/#about", label: "О KGM Torres" },
  { href: "/#prizes", label: "Призы розыгрыша" },
  { href: "/#how", label: "Как участвовать" },
];

const SCROLL_THRESHOLD = 56;

type HeaderProps = {
  solid?: boolean;
};

function BurgerIcon({ open }: { open: boolean }) {
  const lineClass =
    "absolute right-0 h-[2.5px] rounded-full bg-brand transition-all duration-300 ease-out";

  return (
    <span className="relative block h-[14px] w-[28px]" aria-hidden>
      <span
        className={`${lineClass} top-0 w-full ${open ? "top-1/2 w-full -translate-y-1/2 rotate-45" : ""}`}
      />
      <span
        className={`${lineClass} top-1/2 w-[18px] -translate-y-1/2 ${open ? "scale-0 opacity-0" : ""}`}
      />
      <span
        className={`${lineClass} bottom-0 w-full ${open ? "bottom-1/2 w-full translate-y-1/2 -rotate-45" : ""}`}
      />
    </span>
  );
}

export function Header({ solid = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isSolid = solid || scrolled;

  useEffect(() => {
    if (solid) return;

    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    function onResize() {
      if (window.matchMedia("(min-width: 60rem)").matches) {
        setMenuOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-transparent pt-3 transition-all duration-300 ease-in-out sm:pt-4">
        <div className="section-container">
          <div
            className={`grid h-[52px] grid-cols-[auto_1fr_auto] items-center px-2 transition-all duration-300 ease-in-out sm:h-[70px] sm:px-3 md:grid-cols-[1fr_auto_1fr] ${
              isSolid ? "rounded-full bg-black" : ""
            }`}
          >
            <div className="relative flex h-[40px] shrink-0 items-center justify-self-start sm:h-[52px]">
              <div
                aria-hidden
                className={`absolute inset-0 rounded-full bg-black/30 backdrop-blur-md transition-all duration-300 ease-in-out ${
                  isSolid
                    ? "pointer-events-none scale-95 opacity-0"
                    : "scale-100 opacity-100"
                }`}
              />

              <div className="relative flex h-full items-center px-5 sm:px-10">
                <Image
                  src={LANDING_IMAGES.logoKgmWhite}
                  alt="KGM"
                  width={252}
                  height={54}
                  className="h-[20px] w-auto sm:h-[28px]"
                  priority
                />
              </div>
            </div>

            <nav className="hidden items-center justify-self-center gap-8 text-[15px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] md:flex lg:gap-10">
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
              href="/#register"
              className="hidden h-[52px] shrink-0 items-center justify-center justify-self-end rounded-full bg-surface px-6 text-base font-semibold text-brand transition hover:bg-white sm:inline-flex sm:px-8 sm:text-[17px]"
            >
              Регистрация
            </Link>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="header-mobile-menu"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={toggleMenu}
              className="inline-flex h-[40px] w-[80px] shrink-0 items-center justify-center justify-self-end rounded-full bg-surface transition hover:bg-white sm:hidden"
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="header-mobile-menu"
        className={`fixed inset-0 z-40 sm:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Закрыть меню"
          onClick={closeMenu}
          className={`absolute inset-0 bg-brand/35 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`section-container absolute inset-x-0 top-[72px] transition-[opacity,transform] duration-300 ease-out ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 opacity-0"
          }`}
        >
          <nav className="overflow-hidden rounded-[20px] border border-white/20 bg-surface/95 p-6 shadow-[0_24px_60px_rgba(46,44,79,0.18)] backdrop-blur-md">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className={`block rounded-[20px] px-4 py-4 text-lg font-medium text-brand transition-[background-color,color,opacity,transform] duration-300 ease-out hover:bg-brand/5 ${
                      menuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    }`}
                    style={{
                      transitionDelay: menuOpen ? `${80 + index * 60}ms` : "0ms",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div
              className={`mt-4 border-t border-border pt-4 transition-[opacity,transform] duration-300 ease-out ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? "260ms" : "0ms" }}
            >
              <Link
                href="/#register"
                onClick={closeMenu}
                className="btn-primary w-full"
              >
                Регистрация
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
