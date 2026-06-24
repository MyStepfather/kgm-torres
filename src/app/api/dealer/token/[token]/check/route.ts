import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;

  const registration = await prisma.registration.findUnique({
    where: { token },
    select: { id: true },
  });

  if (!registration) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  return NextResponse.json({ valid: true });
}
