import { NextRequest, NextResponse } from "next/server";
import {
  generatePin,
  hashPin,
  isValidPin,
  normalizeLogin,
  slugifyLogin,
} from "@/lib/dealer-credentials";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dealers = await prisma.dealer.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      city: true,
      address: true,
      login: true,
      createdAt: true,
      _count: {
        select: { registrations: true },
      },
    },
  });

  return NextResponse.json(
    dealers.map((dealer) => ({
      id: dealer.id,
      name: dealer.name,
      city: dealer.city,
      address: dealer.address,
      login: dealer.login,
      createdAt: dealer.createdAt,
      registrationsCount: dealer._count.registrations,
    })),
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      city?: string;
      address?: string;
      login?: string;
      pin?: string;
    };

    const name = body.name?.trim();
    const city = body.city?.trim();

    if (!name || !city) {
      return NextResponse.json(
        { error: "Укажите название и город дилера" },
        { status: 400 },
      );
    }

    const login = body.login?.trim()
      ? normalizeLogin(body.login)
      : slugifyLogin(name);

    if (!login) {
      return NextResponse.json(
        { error: "Не удалось сформировать логин" },
        { status: 400 },
      );
    }

    const existing = await prisma.dealer.findUnique({ where: { login } });
    if (existing) {
      return NextResponse.json(
        { error: "Дилер с таким логином уже существует" },
        { status: 409 },
      );
    }

    const pin = body.pin?.trim() || generatePin();
    if (!isValidPin(pin)) {
      return NextResponse.json(
        { error: "PIN должен состоять из 4 цифр" },
        { status: 400 },
      );
    }

    const pinHash = await hashPin(pin);

    const dealer = await prisma.dealer.create({
      data: {
        name,
        city,
        address: body.address?.trim() || null,
        login,
        pinHash,
      },
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        login: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      dealer: {
        ...dealer,
        registrationsCount: 0,
      },
      credentials: { login, pin },
    });
  } catch (error) {
    console.error("Create dealer error:", error);
    return NextResponse.json(
      { error: "Не удалось создать дилера" },
      { status: 500 },
    );
  }
}
