import { NextRequest, NextResponse } from "next/server";
import { getDealerFromSession } from "@/lib/dealer-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const dealer = await getDealerFromSession();
  if (!dealer) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { token } = await context.params;

  const registration = await prisma.registration.findUnique({
    where: { token },
    include: {
      dealer: {
        select: { id: true, name: true, city: true, address: true },
      },
    },
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

  return NextResponse.json({
    id: registration.id,
    name: registration.name,
    phone: registration.phone,
    email: registration.email,
    city: registration.city,
    testDriveDate: registration.testDriveDate,
    createdAt: registration.createdAt,
    isActivated: registration.isActivated,
    activatedAt: registration.activatedAt,
    dealer: registration.dealer,
  });
}
