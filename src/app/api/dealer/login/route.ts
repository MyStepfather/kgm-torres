import { NextRequest, NextResponse } from "next/server";
import {
  getDealerFromSession,
  setDealerSession,
  verifyDealerCredentials,
} from "@/lib/dealer-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { login?: string; pin?: string };

    if (!body.login?.trim() || !body.pin?.trim()) {
      return NextResponse.json(
        { error: "Введите логин и PIN-код" },
        { status: 400 },
      );
    }

    if (!/^\d{4}$/.test(body.pin)) {
      return NextResponse.json(
        { error: "PIN-код должен состоять из 4 цифр" },
        { status: 400 },
      );
    }

    const dealer = await verifyDealerCredentials(
      body.login.trim().toLowerCase(),
      body.pin,
    );

    if (!dealer) {
      return NextResponse.json(
        { error: "Неверный логин или PIN-код" },
        { status: 401 },
      );
    }

    await setDealerSession(dealer.id);

    return NextResponse.json({
      id: dealer.id,
      name: dealer.name,
      city: dealer.city,
    });
  } catch (error) {
    console.error("Dealer login error:", error);
    return NextResponse.json(
      { error: "Ошибка авторизации" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const dealer = await getDealerFromSession();
  if (!dealer) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    dealer: {
      id: dealer.id,
      name: dealer.name,
      city: dealer.city,
    },
  });
}
