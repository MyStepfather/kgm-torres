import { AboutTorres } from "@/components/landing/AboutTorres";
import { Footer } from "@/components/landing/Footer";
import { GiveawaySection } from "@/components/landing/GiveawaySection";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowToParticipate } from "@/components/landing/HowToParticipate";
import { Prizes } from "@/components/landing/Prizes";
import { RegistrationFormClient } from "@/components/landing/RegistrationFormClient";
import { getDealers } from "@/lib/dealers";
import {
  getIsTestDriveRegistrationOpen,
  getTestDrivePeriodLabel,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dealers, testDrivePeriodLabel, isRegistrationOpen] = await Promise.all([
    getDealers(),
    getTestDrivePeriodLabel(),
    getIsTestDriveRegistrationOpen(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero testDrivePeriodLabel={testDrivePeriodLabel} />
        <AboutTorres />
        <Prizes />
        <GiveawaySection />
        <HowToParticipate testDrivePeriodLabel={testDrivePeriodLabel} />
        {isRegistrationOpen ? (
          <RegistrationFormClient
            dealers={dealers}
            testDrivePeriodLabel={testDrivePeriodLabel}
          />
        ) : null}
      </main>
      <Footer />
    </>
  );
}
