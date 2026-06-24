import { NextRequest, NextResponse } from "next/server";
import {
  generatePin,
  hashPin,
  isValidPin,
} from "@/lib/dealer-credentials";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { pin?: string };

    const dealer = await prisma.dealer.findUnique({ where: { id } });
    if (!dealer) {
      return NextResponse.json({ error: "Дилер не найден" }, { status: 404 });
    }

    const pin = body.pin?.trim() || generatePin();
    if (!isValidPin(pin)) {
      return NextResponse.json(
        { error: "PIN должен состоять из 4 цифр" },
        { status: 400 },
      );
    }

    const pinHash = await hashPin(pin);

    await prisma.dealer.update({
      where: { id },
      data: { pinHash },
    });

    return NextResponse.json({
      login: dealer.login,
      pin,
    });
  } catch (error) {
    console.error("Reset dealer password error:", error);
    return NextResponse.json(
      { error: "Не удалось сменить пароль" },
      { status: 500 },
    );
  }
}
