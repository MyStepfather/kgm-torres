import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "KGM Torres — Тест-драйв и розыгрыш Champion",
  description:
    "Пройдите тест-драйв KGM Torres и участвуйте в розыгрыше садовой техники Champion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${notoSans.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
