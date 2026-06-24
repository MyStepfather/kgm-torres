import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      token: true,
      name: true,
      phone: true,
      email: true,
      city: true,
      isActivated: true,
      activatedAt: true,
      testDriveDate: true,
      createdAt: true,
      dealer: {
        select: {
          name: true,
          city: true,
        },
      },
    },
  });

  return NextResponse.json(registrations);
}
