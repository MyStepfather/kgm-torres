import { NextRequest, NextResponse } from "next/server";
import { normalizeLogin } from "@/lib/dealer-credentials";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      name?: string;
      city?: string;
      address?: string;
      email?: string;
      login?: string;
    };

    const dealer = await prisma.dealer.findUnique({ where: { id } });
    if (!dealer) {
      return NextResponse.json({ error: "Дилер не найден" }, { status: 404 });
    }

    const name = body.name?.trim();
    const city = body.city?.trim();

    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "Укажите название дилера" },
        { status: 400 },
      );
    }

    if (city !== undefined && !city) {
      return NextResponse.json(
        { error: "Укажите город дилера" },
        { status: 400 },
      );
    }

    let login: string | undefined;
    if (body.login !== undefined) {
      login = normalizeLogin(body.login);
      if (!login) {
        return NextResponse.json(
          { error: "Укажите корректный логин" },
          { status: 400 },
        );
      }

      if (login !== dealer.login) {
        const existing = await prisma.dealer.findUnique({ where: { login } });
        if (existing) {
          return NextResponse.json(
            { error: "Дилер с таким логином уже существует" },
            { status: 409 },
          );
        }
      }
    }

    let email: string | null | undefined;
    if (body.email !== undefined) {
      const emailRaw = body.email.trim().toLowerCase();
      email = emailRaw || null;
      if (email && !isValidEmail(email)) {
        return NextResponse.json(
          { error: "Укажите корректный email" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.dealer.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(body.address !== undefined
          ? { address: body.address.trim() || null }
          : {}),
        ...(email !== undefined ? { email } : {}),
        ...(login !== undefined ? { login } : {}),
      },
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        email: true,
        login: true,
        createdAt: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      city: updated.city,
      address: updated.address,
      email: updated.email,
      login: updated.login,
      createdAt: updated.createdAt,
      registrationsCount: updated._count.registrations,
    });
  } catch (error) {
    console.error("Update dealer error:", error);
    return NextResponse.json(
      { error: "Не удалось обновить дилера" },
      { status: 500 },
    );
  }
}
