import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { generatePin, hashPin } from "@/lib/dealer-credentials";
import { prisma } from "@/lib/prisma";

function uniquePin(usedPins: Set<string>) {
  let pin: string;
  do {
    pin = generatePin();
  } while (usedPins.has(pin));
  usedPins.add(pin);
  return pin;
}

export async function POST() {
  try {
    const dealers = await prisma.dealer.findMany({
      orderBy: [{ city: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        city: true,
        login: true,
      },
    });

    if (!dealers.length) {
      return NextResponse.json({ error: "Дилеры не найдены" }, { status: 404 });
    }

    const usedPins = new Set<string>();
    const rows: Array<{
      "№": number;
      город: string;
      name: string;
      login: string;
      "новый pin": string;
    }> = [];

    for (let index = 0; index < dealers.length; index += 1) {
      const dealer = dealers[index];
      const pin = uniquePin(usedPins);
      const pinHash = await hashPin(pin);

      await prisma.dealer.update({
        where: { id: dealer.id },
        data: { pinHash },
      });

      rows.push({
        "№": index + 1,
        город: dealer.city,
        name: dealer.name,
        login: dealer.login,
        "новый pin": pin,
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Дилеры");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const date = new Date().toISOString().slice(0, 10);
    const filename = `dealer-pins-${date}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Reset pins export error:", error);
    return NextResponse.json(
      { error: "Не удалось сбросить PIN и выгрузить файл" },
      { status: 500 },
    );
  }
}
