import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { LegalDocumentPage } from "@/components/landing/LegalDocumentPage";
import { getLegalDocument } from "@/lib/legal-documents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Полные правила акции — KGM Torres",
  description: "Правила проведения рекламной акции «KGM Torres. Тест-драйв»",
};

export default async function PromotionRulesPage() {
  const document = await getLegalDocument("rules");

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
