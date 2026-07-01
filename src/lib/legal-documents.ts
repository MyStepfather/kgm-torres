import type { DocumentSection } from "@/lib/promotion-rules-content";
import { PERSONAL_DATA_CONSENT_SECTIONS } from "@/lib/personal-data-consent-content";
import { PRIVACY_POLICY_SECTIONS } from "@/lib/privacy-policy-content";
import { PROMOTION_RULES_SECTIONS } from "@/lib/promotion-rules-content";
import { prisma } from "@/lib/prisma";
import type {
  LegalDocumentContent,
  LegalDocumentRecord,
  LegalDocumentSlug,
} from "@/lib/legal-document-types";

export type {
  LegalDocumentContent,
  LegalDocumentRecord,
  LegalDocumentSlug,
} from "@/lib/legal-document-types";

export {
  isLegalDocumentSlug,
  LEGAL_DOCUMENT_LABELS,
  LEGAL_DOCUMENT_SLUGS,
} from "@/lib/legal-document-types";

const LEGAL_DOCUMENT_KEY_PREFIX = "legal-document:";

function settingKey(slug: LegalDocumentSlug) {
  return `${LEGAL_DOCUMENT_KEY_PREFIX}${slug}`;
}

export function sectionsToMarkdown(sections: DocumentSection[]): string {
  return sections
    .map((section) => {
      const body = section.paragraphs.join("\n\n");
      return `## ${section.title}\n\n${body}`;
    })
    .join("\n\n");
}

const DEFAULT_SECTIONS: Record<LegalDocumentSlug, DocumentSection[]> = {
  privacy: PRIVACY_POLICY_SECTIONS,
  rules: PROMOTION_RULES_SECTIONS,
  consent: PERSONAL_DATA_CONSENT_SECTIONS,
};

const DEFAULT_PAGE_TITLES: Record<LegalDocumentSlug, string> = {
  privacy: "Политика конфиденциальности",
  rules: "Полные правила акции",
  consent: "Согласие на обработку персональных данных",
};

export function getDefaultLegalDocument(
  slug: LegalDocumentSlug,
): LegalDocumentContent {
  return {
    pageTitle: DEFAULT_PAGE_TITLES[slug],
    markdown: sectionsToMarkdown(DEFAULT_SECTIONS[slug]),
  };
}

function normalizeLegalDocument(
  slug: LegalDocumentSlug,
  input: Partial<LegalDocumentContent> | null | undefined,
): LegalDocumentContent {
  const fallback = getDefaultLegalDocument(slug);
  const pageTitle =
    typeof input?.pageTitle === "string" && input.pageTitle.trim()
      ? input.pageTitle.trim()
      : fallback.pageTitle;
  const markdown =
    typeof input?.markdown === "string" && input.markdown.trim()
      ? input.markdown
      : fallback.markdown;

  return { pageTitle, markdown };
}

export function validateLegalDocument(content: LegalDocumentContent) {
  if (!content.pageTitle.trim()) {
    return "Укажите заголовок страницы";
  }

  if (!content.markdown.trim()) {
    return "Текст документа не может быть пустым";
  }

  return null;
}

export async function getLegalDocument(
  slug: LegalDocumentSlug,
): Promise<LegalDocumentRecord> {
  const existing = await prisma.setting.findUnique({
    where: { key: settingKey(slug) },
  });

  if (!existing) {
    const defaults = getDefaultLegalDocument(slug);
    return {
      slug,
      ...defaults,
      updatedAt: null,
      isDefault: true,
    };
  }

  const value = existing.value as Partial<LegalDocumentContent>;
  const normalized = normalizeLegalDocument(slug, value);

  return {
    slug,
    ...normalized,
    updatedAt: existing.updatedAt.toISOString(),
    isDefault: false,
  };
}

export async function saveLegalDocument(
  slug: LegalDocumentSlug,
  input: Partial<LegalDocumentContent>,
): Promise<LegalDocumentRecord> {
  const normalized = normalizeLegalDocument(slug, input);
  const validationError = validateLegalDocument(normalized);

  if (validationError) {
    throw new Error(validationError);
  }

  const saved = await prisma.setting.upsert({
    where: { key: settingKey(slug) },
    create: {
      key: settingKey(slug),
      value: normalized,
    },
    update: {
      value: normalized,
    },
  });

  return {
    slug,
    ...normalized,
    updatedAt: saved.updatedAt.toISOString(),
    isDefault: false,
  };
}

export async function resetLegalDocument(
  slug: LegalDocumentSlug,
): Promise<LegalDocumentRecord> {
  await prisma.setting.deleteMany({
    where: { key: settingKey(slug) },
  });

  const defaults = getDefaultLegalDocument(slug);
  return {
    slug,
    ...defaults,
    updatedAt: null,
    isDefault: true,
  };
}
