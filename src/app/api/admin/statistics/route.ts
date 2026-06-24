import { NextRequest, NextResponse } from "next/server";
import {
  REGISTRATION_LIST_SELECT,
  buildRegistrationWhere,
  parseRegistrationFilters,
  parseRegistrationPagination,
  serializeRegistration,
} from "@/lib/admin-registration-filters";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filters = parseRegistrationFilters(searchParams);
    const { page, pageSize, skip } = parseRegistrationPagination(searchParams);
    const where = buildRegistrationWhere(filters);

    const [totalParticipants, totalActivated, items, cities] = await Promise.all([
        prisma.registration.count({ where }),
        prisma.registration.count({ where: { ...where, isActivated: true } }),
        prisma.registration.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
          select: REGISTRATION_LIST_SELECT,
        }),
        prisma.registration.findMany({
          distinct: ["city"],
          select: { city: true },
          orderBy: { city: "asc" },
        }),
      ]);

    return NextResponse.json({
      summary: {
        totalParticipants,
        totalActivated,
      },
      items: items.map(serializeRegistration),
      pagination: {
        page,
        pageSize,
        total: totalParticipants,
        totalPages: Math.max(1, Math.ceil(totalParticipants / pageSize)),
      },
      cities: cities.map((item) => item.city),
    });
  } catch (error) {
    console.error("Statistics error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить статистику" },
      { status: 500 },
    );
  }
}
