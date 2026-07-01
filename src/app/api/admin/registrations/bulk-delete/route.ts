import { NextRequest, NextResponse } from "next/server";
import { deleteRegistrations } from "@/lib/admin-registrations";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { ids?: string[] };
    const ids = Array.isArray(body.ids) ? body.ids : [];

    const deletedCount = await deleteRegistrations(ids);

    return NextResponse.json({ deletedCount });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось удалить регистрации";

    const status = message.includes("не найден") ? 404 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
