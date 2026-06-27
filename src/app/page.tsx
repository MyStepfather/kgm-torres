import { AboutTorres } from "@/components/landing/AboutTorres";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowToParticipate } from "@/components/landing/HowToParticipate";
import { Prizes } from "@/components/landing/Prizes";
import { RegistrationFormClient } from "@/components/landing/RegistrationFormClient";
import { getDealers } from "@/lib/dealers";
import { getGiveawayDateLabel } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dealers, giveawayDateLabel] = await Promise.all([
    getDealers(),
    getGiveawayDateLabel(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutTorres />
        <Prizes />
        <HowToParticipate />
        <RegistrationFormClient
          dealers={dealers}
          giveawayDateLabel={giveawayDateLabel}
        />
      </main>
      <Footer />
    </>
  );
}
