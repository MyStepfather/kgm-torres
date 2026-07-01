import { NextResponse } from "next/server";
import { deleteRegistrations } from "@/lib/admin-registrations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deletedCount = await deleteRegistrations([id]);

    return NextResponse.json({ deletedCount });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось удалить регистрацию";

    const status = message.includes("не найден") ? 404 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
