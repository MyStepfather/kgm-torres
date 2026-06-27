import { AboutTorres } from "@/components/landing/AboutTorres";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowToParticipate } from "@/components/landing/HowToParticipate";
import { Prizes } from "@/components/landing/Prizes";
import { RegistrationFormClient } from "@/components/landing/RegistrationFormClient";
import { getDealers } from "@/lib/dealers";
import { getTestDrivePeriodLabel } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dealers, testDrivePeriodLabel] = await Promise.all([
    getDealers(),
    getTestDrivePeriodLabel(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero testDrivePeriodLabel={testDrivePeriodLabel} />
        <AboutTorres />
        <Prizes />
        <HowToParticipate testDrivePeriodLabel={testDrivePeriodLabel} />
        <RegistrationFormClient
          dealers={dealers}
          testDrivePeriodLabel={testDrivePeriodLabel}
        />
      </main>
      <Footer />
    </>
  );
}
