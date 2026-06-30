import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { LegalDocumentPage } from "@/components/landing/LegalDocumentPage";
import { PRIVACY_POLICY_SECTIONS } from "@/lib/privacy-policy-content";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — KGM Torres",
  description:
    "Политика конфиденциальности акции «Тест-драйв KGM Torres — выиграй технику Champion»",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header solid />
      <main className="bg-background">
        <LegalDocumentPage
          title="Политика конфиденциальности"
          sections={PRIVACY_POLICY_SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
}
