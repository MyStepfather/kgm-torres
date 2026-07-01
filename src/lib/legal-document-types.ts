export type LegalDocumentSlug = "privacy" | "rules" | "consent";

export type LegalDocumentContent = {
  pageTitle: string;
  markdown: string;
};

export type LegalDocumentRecord = LegalDocumentContent & {
  slug: LegalDocumentSlug;
  updatedAt: string | null;
  isDefault: boolean;
};

export const LEGAL_DOCUMENT_SLUGS: LegalDocumentSlug[] = [
  "privacy",
  "rules",
  "consent",
];

export const LEGAL_DOCUMENT_LABELS: Record<LegalDocumentSlug, string> = {
  privacy: "Политика конфиденциальности",
  rules: "Правила акции",
  consent: "Согласие на обработку ПДн",
};

export function isLegalDocumentSlug(value: string): value is LegalDocumentSlug {
  return LEGAL_DOCUMENT_SLUGS.includes(value as LegalDocumentSlug);
}
