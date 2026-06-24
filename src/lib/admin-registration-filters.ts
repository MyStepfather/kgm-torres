import type { Prisma } from "@/generated/prisma/client";
import { parseIsoDate } from "@/lib/dates";

export type RegistrationFilters = {
  dealerId?: string;
  city?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export const REGISTRATION_LIST_SELECT = {
  id: true,
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
} as const;

export function parseRegistrationFilters(
  searchParams: URLSearchParams,
  options?: { includeDates?: boolean },
) {
  const includeDates = options?.includeDates ?? true;
  const dealerId = searchParams.get("dealerId")?.trim() || undefined;
  const city = searchParams.get("city")?.trim() || undefined;

  let dateFrom: Date | undefined;
  let dateTo: Date | undefined;

  if (includeDates) {
    const dateFromRaw = searchParams.get("dateFrom")?.trim();
    const dateToRaw = searchParams.get("dateTo")?.trim();
    dateFrom = dateFromRaw ? (parseIsoDate(dateFromRaw) ?? undefined) : undefined;
    dateTo = dateToRaw ? (parseIsoDate(dateToRaw) ?? undefined) : undefined;
  }

  return { dealerId, city, dateFrom, dateTo } satisfies RegistrationFilters;
}

export function buildRegistrationWhere(
  filters: RegistrationFilters,
): Prisma.RegistrationWhereInput {
  const where: Prisma.RegistrationWhereInput = {};

  if (filters.dealerId) {
    where.dealerId = filters.dealerId;
  }

  if (filters.city) {
    where.city = filters.city;
  }

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};

    if (filters.dateFrom) {
      where.createdAt.gte = filters.dateFrom;
    }

    if (filters.dateTo) {
      const end = new Date(filters.dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  return where;
}

export function parseRegistrationPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20),
  );

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
  };
}

export function serializeRegistration(
  registration: {
    id: string;
    name: string;
    phone: string;
    email: string;
    city: string;
    isActivated: boolean;
    activatedAt: Date | null;
    testDriveDate: Date;
    createdAt: Date;
    dealer: { name: string; city: string };
  },
) {
  return {
    id: registration.id,
    name: registration.name,
    phone: registration.phone,
    email: registration.email,
    city: registration.city,
    isActivated: registration.isActivated,
    activatedAt: registration.activatedAt?.toISOString() ?? null,
    testDriveDate: registration.testDriveDate.toISOString().slice(0, 10),
    createdAt: registration.createdAt.toISOString(),
    dealer: registration.dealer,
  };
}
