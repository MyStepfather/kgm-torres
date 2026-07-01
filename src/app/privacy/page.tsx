import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { LegalDocumentPage } from "@/components/landing/LegalDocumentPage";
import { getLegalDocument } from "@/lib/legal-documents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — KGM Torres",
  description:
    "Политика конфиденциальности акции «KGM Torres. Тест-драйв»",
};

export default async function PrivacyPolicyPage() {
  const document = await getLegalDocument("privacy");

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
