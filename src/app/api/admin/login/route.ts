import { NextRequest, NextResponse } from "next/server";
import {
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ADMIN_LOGIN || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Админка не настроена. Задайте ADMIN_LOGIN и ADMIN_PASSWORD в .env" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { login?: string; password?: string };

    if (!body.login?.trim() || !body.password) {
      return NextResponse.json(
        { error: "Введите логин и пароль" },
        { status: 400 },
      );
    }

    if (!verifyAdminCredentials(body.login, body.password)) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 },
      );
    }

    await setAdminSession();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Ошибка авторизации" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}
