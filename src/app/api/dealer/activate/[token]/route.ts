import { NextRequest, NextResponse } from "next/server";
import { getDealerFromSession } from "@/lib/dealer-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function POST(_request: NextRequest, context: RouteContext) {
  const dealer = await getDealerFromSession();
  if (!dealer) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { token } = await context.params;

  const registration = await prisma.registration.findUnique({
    where: { token },
  });

  if (!registration) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }

  if (registration.dealerId !== dealer.id) {
    return NextResponse.json(
      { error: "Эта заявка относится к другому дилерскому центру" },
      { status: 403 },
    );
  }

  if (registration.isActivated) {
    return NextResponse.json(
      {
        error: "Тест-драйв уже пройден",
        activatedAt: registration.activatedAt,
      },
      { status: 409 },
    );
  }

  const updated = await prisma.registration.update({
    where: { id: registration.id },
    data: {
      isActivated: true,
      activatedAt: new Date(),
    },
  });

  return NextResponse.json({
    id: updated.id,
    isActivated: updated.isActivated,
    activatedAt: updated.activatedAt,
  });
}
