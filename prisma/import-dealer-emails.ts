import "dotenv/config";
import * as path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import * as XLSX from "xlsx";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const EMAILS_XLSX_PATH = path.join(process.cwd(), "dealers_email.xlsx");
const DILLERS_XLSX_PATH = path.join(process.cwd(), "dillers_list.xlsx");

type EmailRow = {
  dealerCode: string;
  legalName: string;
  marketingName: string;
  city: string;
  email: string;
};

type DillerRow = {
  legalName: string;
  tradeName: string;
};

type DealerSheetRow = {
  code: string;
  marketingName: string;
  city: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[«»""]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeLegalName(value: string) {
  return normalize(value)
    .replace(/^ооо\s+/, "")
    .replace(/^ао\s+/, "")
    .replace(/^ип\s+/, "");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readSheetRows<T extends Record<string, string>>(
  filePath: string,
  sheetName?: string,
): T[] {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName ?? workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: "" });
}

function parseEmailRows(): EmailRow[] {
  const rows = readSheetRows<Record<string, string>>(
    EMAILS_XLSX_PATH,
    "Пользователи",
  );

  return rows
    .map((row) => ({
      dealerCode: row["Код ДЦ"]?.trim() ?? "",
      legalName: row["Дилер"]?.trim() ?? "",
      marketingName: row["Маркетинговое название"]?.trim() ?? "",
      city: row["Город"]?.trim() ?? "",
      email: normalizeEmail(row["Электронная почта"] ?? ""),
    }))
    .filter((row) => row.email && isValidEmail(row.email));
}

function parseDillerRows(): DillerRow[] {
  const rows = readSheetRows<Record<string, string>>(DILLERS_XLSX_PATH);

  return rows
    .map((row) => ({
      legalName: row["Юр. Наим."]?.trim() ?? "",
      tradeName: row["Торг. Наим."]?.trim() ?? "",
    }))
    .filter((row) => row.legalName && row.tradeName);
}

function parseDealerSheetRows(): DealerSheetRow[] {
  const rows = readSheetRows<Record<string, string>>(
    EMAILS_XLSX_PATH,
    "Дилеры",
  );

  return rows
    .map((row) => ({
      code: row["Код"]?.trim() ?? "",
      marketingName: row["Маркетинговое название"]?.trim() ?? "",
      city: row["Город"]?.trim() ?? "",
    }))
    .filter((row) => row.code);
}

function pickEmail(rows: EmailRow[]) {
  return rows[0]?.email ?? null;
}

function findEmailByLegalName(
  emailRows: EmailRow[],
  legalName: string,
  city?: string,
) {
  const normalizedLegal = normalizeLegalName(legalName);
  const withCity = city
    ? emailRows.filter(
        (row) =>
          normalizeLegalName(row.legalName) === normalizedLegal &&
          normalize(row.city) === normalize(city),
      )
    : [];

  const email = pickEmail(withCity);
  if (email) {
    return email;
  }

  return pickEmail(
    emailRows.filter(
      (row) => normalizeLegalName(row.legalName) === normalizedLegal,
    ),
  );
}

function findDealerSheetRow(
  dealerSheetRows: DealerSheetRow[],
  dealerName: string,
  dealerCity: string,
) {
  const normalizedName = normalize(dealerName);
  const normalizedCity = normalize(dealerCity);

  const exact = dealerSheetRows.find(
    (row) => normalize(row.marketingName) === normalizedName,
  );
  if (exact) {
    return exact;
  }

  return dealerSheetRows.find((row) => {
    const marketing = normalize(row.marketingName);
    const sheetCity = normalize(row.city);

    if (!marketing) {
      return false;
    }

    const cityMatches =
      sheetCity === normalizedCity ||
      normalizedName.includes(sheetCity) ||
      normalizedCity.includes(sheetCity);

    if (!cityMatches) {
      return false;
    }

    return (
      normalizedName.includes(marketing) ||
      marketing.includes(normalizedName) ||
      normalizedName.includes(marketing.split(/[\s(-]/)[0])
    );
  });
}

function findEmailForDealer(
  dealerName: string,
  dealerCity: string,
  dillerRows: DillerRow[],
  emailRows: EmailRow[],
  dealerSheetRows: DealerSheetRow[],
) {
  const diller = dillerRows.find(
    (row) => normalize(row.tradeName) === normalize(dealerName),
  );

  if (diller) {
    const byLegal = findEmailByLegalName(
      emailRows,
      diller.legalName,
      dealerCity,
    );
    if (byLegal) {
      return byLegal;
    }
  }

  const sheetRow = findDealerSheetRow(dealerSheetRows, dealerName, dealerCity);
  if (sheetRow) {
    const byCode = pickEmail(
      emailRows.filter((row) => row.dealerCode === sheetRow.code),
    );
    if (byCode) {
      return byCode;
    }
  }

  const byMarketing = pickEmail(
    emailRows.filter(
      (row) =>
        normalize(row.marketingName) === normalize(dealerName) &&
        normalize(row.city) === normalize(dealerCity),
    ),
  );
  if (byMarketing) {
    return byMarketing;
  }

  return null;
}

async function main() {
  const emailRows = parseEmailRows();
  const dillerRows = parseDillerRows();
  const dealerSheetRows = parseDealerSheetRows();

  if (!emailRows.length) {
    throw new Error('В файле dealers_email.xlsx не найдено email-адресов');
  }

  const dealers = await prisma.dealer.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }],
    select: { id: true, name: true, city: true, emails: true },
  });

  let updated = 0;
  let skipped = 0;
  const unmatched: Array<{ name: string; city: string }> = [];

  for (const dealer of dealers) {
    const email = findEmailForDealer(
      dealer.name,
      dealer.city,
      dillerRows,
      emailRows,
      dealerSheetRows,
    );

    if (!email) {
      unmatched.push({ name: dealer.name, city: dealer.city });
      skipped += 1;
      continue;
    }

    if (dealer.emails.includes(email)) {
      skipped += 1;
      continue;
    }

    await prisma.dealer.update({
      where: { id: dealer.id },
      data: { emails: [...dealer.emails, email] },
    });
    updated += 1;
    console.log(`✓ ${dealer.name} (${dealer.city}) → ${email}`);
  }

  console.log(`\nUpdated: ${updated}`);
  console.log(`Skipped: ${skipped}`);

  if (unmatched.length) {
    console.log(`\nNo email found (${unmatched.length}):`);
    for (const dealer of unmatched) {
      console.log(`  - ${dealer.name} | ${dealer.city}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
