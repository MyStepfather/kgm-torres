import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { LegalDocumentPage } from "@/components/landing/LegalDocumentPage";
import { getLegalDocument } from "@/lib/legal-documents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных — KGM Torres",
  description:
    "Согласие пользователя сайта на обработку персональных данных акции «KGM Torres. Тест-драйв»",
};

export default async function PersonalDataConsentPage() {
  const document = await getLegalDocument("consent");

  return (
    <>
      <Header solid />
      <main className="bg-background">
        <LegalDocumentPage
          title={document.pageTitle}
          markdown={document.markdown}
        />
      </main>
      <Footer />
    </>
  );
}
