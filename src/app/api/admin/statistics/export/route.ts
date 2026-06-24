import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { registrationToExportRow } from "@/lib/admin-registration-export";
import {
  REGISTRATION_LIST_SELECT,
  buildRegistrationWhere,
  parseRegistrationFilters,
  serializeRegistration,
} from "@/lib/admin-registration-filters";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const scope = searchParams.get("scope") === "period" ? "period" : "all";
    const filters = parseRegistrationFilters(searchParams, {
      includeDates: scope === "period",
    });
    const where = buildRegistrationWhere(filters);

    const registrations = await prisma.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: REGISTRATION_LIST_SELECT,
    });

    const rows = registrations.map((registration, index) =>
      registrationToExportRow(serializeRegistration(registration), index),
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Регистрации");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const today = new Date().toISOString().slice(0, 10);
    let filename = `registrations-all-${today}.xlsx`;

    if (scope === "period") {
      const dateFrom = searchParams.get("dateFrom")?.trim() ?? "start";
      const dateTo = searchParams.get("dateTo")?.trim() ?? today;
      filename = `registrations-${dateFrom}_${dateTo}.xlsx`;
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Statistics export error:", error);
    return NextResponse.json(
      { error: "Не удалось выгрузить регистрации" },
      { status: 500 },
    );
  }
}
