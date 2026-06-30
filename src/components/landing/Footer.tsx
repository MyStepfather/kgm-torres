import Image from "next/image";
import Link from "next/link";
import { HomeLink } from "@/components/landing/HomeLink";
import { LANDING_IMAGES } from "@/lib/landing-assets";

const socialLinks = [
  {
    href: "https://vk.com/kgmauto",
    label: "ВКонтакте",
    icon: LANDING_IMAGES.socialVk,
    iconClassName: "h-[13.5px] w-[13.5px] sm:h-[14px] sm:w-[14px] md:h-[18px] md:w-[18px]",
  },
  {
    href: "https://max.ru/join/DrVOBBMG-eF7ah-J735PXF8ijf2prcRLCcdk-zKMRI0",
    label: "MAX",
    icon: LANDING_IMAGES.socialMax,
    iconClassName: "h-[13.5px] w-[13.5px] sm:h-[14px] sm:w-[14px] md:h-[18px] md:w-[18px]",
  },
  {
    href: "https://www.drive2.ru/o/kgm/",
    label: "Drive2",
    icon: LANDING_IMAGES.socialDzen,
    iconClassName: "h-[21px] w-[21px] md:h-[30px] md:w-[30px]",
  },
] as const;

function PhoneIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3 w-3 shrink-0 text-white/50 md:h-4 md:w-4"
      fill="none"
    >
      <path
        d="M3.2 2.5h2.2l1 2.4-1.3 1c.8 1.6 2.1 2.9 3.7 3.7l1-1.3 2.4 1v2.2c0 .6-.5 1.1-1.1 1.1C6.5 12.6 3.4 9.5 2.1 5.6c-.1-.6.4-1.1 1.1-1.1Z"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialLinks() {
  return (
    <div className="flex gap-2 sm:gap-2.5 md:gap-2.5">
      {socialLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7.5px] border border-white/10 bg-white/20 transition hover:bg-white/30 md:h-10 md:w-10 md:rounded-[10px]"
        >
          <Image
            src={item.icon}
            alt=""
            width={18}
            height={18}
            className={item.iconClassName}
          />
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-soft py-10 text-white sm:py-11 md:py-16">
      <div className="section-container">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:flex-wrap sm:items-start sm:justify-start sm:gap-x-12 sm:gap-y-8 md:gap-x-[177px] lg:gap-x-64">
          <div className="w-full max-w-[360px] rounded-[22px] bg-white/[0.03] px-7 py-6 sm:w-fit sm:max-w-[265px] sm:px-5 sm:py-5 md:w-fit md:max-w-[486px] md:rounded-[40px] md:p-0 md:pt-[43px] md:pr-[46px] md:pb-[43px] md:pl-[32px]">
            <HomeLink
              className="flex items-center gap-4 sm:gap-[13px] md:gap-6"
              aria-label="На главную"
            >
              <Image
                src={LANDING_IMAGES.logoKgmWhite}
                alt="KGM"
                width={252}
                height={54}
                className="h-7 w-auto sm:h-[26px] md:h-[41px]"
              />
              <Image
                src={LANDING_IMAGES.logoChampionWhite}
                alt="Champion"
                width={332}
                height={116}
                className="h-7 w-auto sm:h-[26px] md:h-[41px]"
              />
            </HomeLink>
          </div>

          <div className="flex flex-col items-start sm:pt-1">
            <h3 className="descriptor text-white/40">Документы</h3>
            <ul className="mt-4 space-y-3 text-sm sm:mt-5 sm:space-y-3 sm:text-sm md:text-[15px]">
              <li>
                <Link
                  href="/rules"
                  className="font-medium text-white transition hover:text-white/80"
                >
                  Полные правила акции
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="font-medium text-white transition hover:text-white/80"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start sm:pt-1">
            <h3 className="descriptor text-white/40">Контакты</h3>
            <ul className="mt-4 space-y-3 text-sm sm:mt-5 md:text-[15px]">
              <li>
                <a
                  href="tel:88001013353"
                  className="inline-flex items-center gap-2 font-medium text-white transition hover:text-white/80"
                >
                  <PhoneIcon />
                  8 800 101-33-53
                </a>
              </li>
            </ul>

            <div className="mt-6 sm:mt-8 md:mt-10">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
