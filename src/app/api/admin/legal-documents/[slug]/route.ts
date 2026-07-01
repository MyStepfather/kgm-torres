import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getDefaultLegalDocument,
  getLegalDocument,
  isLegalDocumentSlug,
  resetLegalDocument,
  saveLegalDocument,
  type LegalDocumentContent,
} from "@/lib/legal-documents";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!isLegalDocumentSlug(slug)) {
    return NextResponse.json({ error: "Документ не найден" }, { status: 404 });
  }

  const document = await getLegalDocument(slug);
  return NextResponse.json(document);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!isLegalDocumentSlug(slug)) {
    return NextResponse.json({ error: "Документ не найден" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Partial<LegalDocumentContent>;
    const saved = await saveLegalDocument(slug, body);
    revalidatePath(`/${slug}`);
    return NextResponse.json(saved);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось сохранить документ";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!isLegalDocumentSlug(slug)) {
    return NextResponse.json({ error: "Документ не найден" }, { status: 404 });
  }

  const body = (await request.json()) as { action?: string };

  if (body.action === "reset") {
    const document = await resetLegalDocument(slug);
    revalidatePath(`/${slug}`);
    return NextResponse.json(document);
  }

  const defaults = getDefaultLegalDocument(slug);
  return NextResponse.json(defaults);
}
