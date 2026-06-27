import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { LegalDocumentPage } from "@/components/landing/LegalDocumentPage";
import { PROMOTION_RULES_SECTIONS } from "@/lib/promotion-rules-content";

export const metadata: Metadata = {
  title: "Полные правила акции — KGM Torres",
  description:
    "Полные правила акции «Тест-драйв KGM Torres — выиграй технику Champion»",
};

export default function PromotionRulesPage() {
  return (
    <>
      <Header solid />
      <main className="bg-background">
        <LegalDocumentPage
          title="Полные правила акции"
          sections={PROMOTION_RULES_SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
}
