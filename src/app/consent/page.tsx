import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { LegalDocumentPage } from "@/components/landing/LegalDocumentPage";
import { PERSONAL_DATA_CONSENT_SECTIONS } from "@/lib/personal-data-consent-content";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных — KGM Torres",
  description:
    "Согласие пользователя сайта на обработку персональных данных акции «KGM Torres. Тест-драйв»",
};

export default function PersonalDataConsentPage() {
  return (
    <>
      <Header solid />
      <main className="bg-background">
        <LegalDocumentPage
          title="Согласие на обработку персональных данных"
          sections={PERSONAL_DATA_CONSENT_SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
}
