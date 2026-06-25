import { NextRequest, NextResponse } from "next/server";
import { sendRegistrationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { formatPhone, normalizePhone } from "@/lib/phone";
import { buildRegistrationQr } from "@/lib/qrcode";
import { parseIsoDate } from "@/lib/dates";
import { getTestDriveSchedule } from "@/lib/settings";
import { isValidTestDriveDate } from "@/lib/test-drive-schedule";
import { isValidEmail } from "@/lib/validation";

type RegistrationBody = {
  name: string;
  phone: string;
  email: string;
  city: string;
  dealerId: string;
  consentPersonal: boolean;
  consentMarketing: boolean;
  testDriveDate: string;
};

async function ensureRegistrationQr(registration: {
  token: string;
  scanUrl: string | null;
  qrDataUrl: string | null;
}) {
  if (registration.scanUrl && registration.qrDataUrl) {
    return {
      scanUrl: registration.scanUrl,
      qrDataUrl: registration.qrDataUrl,
    };
  }

  const qr = await buildRegistrationQr(registration.token);
  await prisma.registration.update({
    where: { token: registration.token },
    data: {
      scanUrl: qr.scanUrl,
      qrDataUrl: qr.qrDataUrl,
    },
  });

  return qr;
}

function registrationResponse(
  registration: {
    token: string;
    scanUrl: string;
    qrDataUrl: string;
    createdAt: Date;
    testDriveDate: Date;
    dealer: { name: string; city: string };
  },
  options?: { isDuplicate?: boolean },
) {
  return NextResponse.json({
    id: registration.token,
    token: registration.token,
    scanUrl: registration.scanUrl,
    qrDataUrl: registration.qrDataUrl,
    dealer: registration.dealer,
    testDriveDate: registration.testDriveDate,
    createdAt: registration.createdAt,
    isDuplicate: options?.isDuplicate ?? false,
    message: options?.isDuplicate
      ? "Вы уже зарегистрированы"
      : undefined,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegistrationBody;

    if (
      !body.name?.trim() ||
      !body.phone?.trim() ||
      !body.email?.trim() ||
      !body.city?.trim() ||
      !body.dealerId ||
      !body.testDriveDate?.trim()
    ) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 },
      );
    }

    if (!body.consentPersonal) {
      return NextResponse.json(
        { error: "Необходимо согласие на обработку персональных данных" },
        { status: 400 },
      );
    }

    const phoneNormalized = normalizePhone(body.phone);
    if (!phoneNormalized) {
      return NextResponse.json(
        { error: "Укажите корректный телефон в формате +7 (999) 000-00-00" },
        { status: 400 },
      );
    }

    const email = body.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Укажите корректный email" },
        { status: 400 },
      );
    }

    if (!isValidTestDriveDate(body.testDriveDate, await getTestDriveSchedule())) {
      return NextResponse.json(
        { error: "Выберите корректную дату тест-драйва" },
        { status: 400 },
      );
    }

    const testDriveDate = parseIsoDate(body.testDriveDate)!;

    const existing = await prisma.registration.findFirst({
      where: {
        OR: [{ phoneNormalized }, { email }],
      },
      include: {
        dealer: {
          select: { name: true, city: true },
        },
      },
    });

    if (existing) {
      const qr = await ensureRegistrationQr(existing);
      return registrationResponse(
        {
          token: existing.token,
          scanUrl: qr.scanUrl,
          qrDataUrl: qr.qrDataUrl,
          createdAt: existing.createdAt,
          testDriveDate: existing.testDriveDate,
          dealer: existing.dealer,
        },
        { isDuplicate: true },
      );
    }

    const dealer = await prisma.dealer.findUnique({
      where: { id: body.dealerId },
    });

    if (!dealer) {
      return NextResponse.json(
        { error: "Выбранный дилер не найден" },
        { status: 400 },
      );
    }

    const registration = await prisma.registration.create({
      data: {
        name: body.name.trim(),
        phone: formatPhone(phoneNormalized),
        phoneNormalized,
        email,
        city: body.city.trim(),
        dealerId: body.dealerId,
        consentPersonal: body.consentPersonal,
        consentMarketing: Boolean(body.consentMarketing),
        testDriveDate,
        scanUrl: "",
        qrDataUrl: "",
      },
      include: {
        dealer: {
          select: { name: true, city: true },
        },
      },
    });

    const qr = await buildRegistrationQr(registration.token);
    const saved = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        scanUrl: qr.scanUrl,
        qrDataUrl: qr.qrDataUrl,
      },
      include: {
        dealer: {
          select: { name: true, city: true },
        },
      },
    });

    try {
      await sendRegistrationEmail({
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        city: saved.city,
        dealerName: saved.dealer.name,
        dealerCity: saved.dealer.city,
        testDriveDate: saved.testDriveDate,
        scanUrl: saved.scanUrl,
        qrDataUrl: saved.qrDataUrl,
      });
    } catch (emailError) {
      console.error("Registration email error:", emailError);
    }

    return registrationResponse(saved);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 },
    );
  }
}
