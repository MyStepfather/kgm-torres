import "dotenv/config";
import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const XLSX_PATH = path.join(process.cwd(), "dillers_list.xlsx");
const CREDENTIALS_DIR = path.join(process.cwd(), "data");
const CREDENTIALS_CSV = path.join(CREDENTIALS_DIR, "dealer-credentials.csv");
const CREDENTIALS_XLSX = path.join(CREDENTIALS_DIR, "dealer-credentials.xlsx");

type DealerRow = {
  name: string;
  city: string;
  address: string;
};

const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function normalizeAddress(address: string) {
  return address.replace(/\r\n/g, ", ").replace(/\s+/g, " ").trim();
}

function cleanCity(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/\.$/, "");
}

function extractCity(address: string): string {
  const raw = normalizeAddress(address);
  let a = raw.replace(/^(\d{5,6})\.?\s*,?\s*/, "");

  const gorodFirst = a.match(/город\s+([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/i);
  if (gorodFirst) {
    return cleanCity(gorodFirst[1]);
  }

  const patterns: RegExp[] = [
    /,\s*г\.?\s*([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?:,|$)/i,
    /(?:^|[,\s])г\.?\s+(?!ород)([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/gi,
    /Г\.\s*([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/,
    /,\s*([А-ЯЁа-яё][А-ЯЁа-яё-]+)\s+г(?:,|$)/i,
    /г\.о\.\s*([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/i,
    /обл\.?,?\s*г\.?\s*([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/i,
    /область,?\s*г\.?\s*([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/i,
    /край,?\s*г\.?\s*([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/i,
    /аул\s+([А-ЯЁа-яё][А-ЯЁа-яё\s-]+?)(?=,|$)/i,
  ];

  for (const pattern of patterns) {
    if (pattern.global) {
      const matches = [...a.matchAll(pattern)];
      if (matches.length) {
        return cleanCity(matches[matches.length - 1][1]);
      }
      continue;
    }

    const match = a.match(pattern);
    if (match) {
      return cleanCity(match[1]);
    }
  }

  if (/МКАД|Симферопольского/i.test(a)) {
    return "Москва";
  }

  const first = a.split(",")[0].trim();
  const firstCity = /^город/i.test(first)
    ? first.replace(/^город\s+/i, "")
    : first.replace(/^г\.?\s+/i, "");
  if (
    first &&
    !/^\d+$/.test(first) &&
    !/область|обл\.?|край|район|округ|республика|ФЕДЕРАЦИЯ/i.test(first)
  ) {
    return cleanCity(firstCity);
  }

  if (/Оренбург/i.test(a)) return "Оренбург";
  if (/Минераловод/i.test(a)) return "Минеральные Воды";
  if (/Брянск/i.test(a)) return "Брянск";

  return "Не указан";
}

function transliterate(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((char) => TRANSLIT_MAP[char] ?? char)
    .join("");
}

function slugifyLogin(name: string) {
  return transliterate(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
}

function uniqueLogin(base: string, used: Set<string>) {
  let login = base || "dealer";
  let suffix = 2;

  while (used.has(login)) {
    login = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(login);
  return login;
}

function generatePin(used: Set<string>) {
  let pin = "";
  do {
    pin = String(crypto.randomInt(1000, 10000));
  } while (used.has(pin));
  used.add(pin);
  return pin;
}

function parseDealersFromXlsx(): DealerRow[] {
  const workbook = XLSX.readFile(XLSX_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
  });

  return rows
    .map((row) => {
      const name = row["Торг. Наим."]?.trim();
      const address = normalizeAddress(row["Факт. Адрес"] ?? "");

      if (!name || !address) {
        return null;
      }

      return {
        name,
        city: extractCity(address),
        address,
      };
    })
    .filter((row): row is DealerRow => row !== null);
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

async function main() {
  const dealers = parseDealersFromXlsx();
  if (!dealers.length) {
    throw new Error("В файле dillers_list.xlsx не найдено дилеров");
  }

  const usedLogins = new Set<string>();
  const usedPins = new Set<string>();
  const credentials: Array<{
    login: string;
    pin: string;
    name: string;
    city: string;
    address: string;
  }> = [];

  await prisma.registration.deleteMany();
  await prisma.dealer.deleteMany();

  for (const dealer of dealers) {
    const login = uniqueLogin(slugifyLogin(dealer.name), usedLogins);
    const pin = generatePin(usedPins);
    const pinHash = await bcrypt.hash(pin, 10);

    await prisma.dealer.create({
      data: {
        name: dealer.name,
        city: dealer.city,
        address: dealer.address,
        login,
        pinHash,
      },
    });

    credentials.push({ login, pin, ...dealer });
  }

  fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });

  const csvHeader = "login,pin,name,city,address\n";
  const csvBody = credentials
    .map((item) =>
      [item.login, item.pin, item.name, item.city, item.address]
        .map(csvEscape)
        .join(","),
    )
    .join("\n");
  fs.writeFileSync(CREDENTIALS_CSV, `\uFEFF${csvHeader}${csvBody}`, "utf8");

  const worksheet = XLSX.utils.json_to_sheet(
    credentials.map((item) => ({
      Логин: item.login,
      "PIN (4 цифры)": item.pin,
      "Торг. наименование": item.name,
      Город: item.city,
      "Факт. адрес": item.address,
    })),
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Дилеры");
  XLSX.writeFile(workbook, CREDENTIALS_XLSX);

  console.log(`Imported ${credentials.length} dealers`);
  console.log(`Credentials CSV: ${CREDENTIALS_CSV}`);
  console.log(`Credentials XLSX: ${CREDENTIALS_XLSX}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
