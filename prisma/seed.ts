import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const dealers = [
  {
    name: "KGM Центр Москва",
    city: "Москва",
    address: "ул. Автозаводская, 23",
    login: "moscow",
    pin: "1234",
  },
  {
    name: "KGM Санкт-Петербург",
    city: "Санкт-Петербург",
    address: "пр. Обуховской Обороны, 120",
    login: "spb",
    pin: "2345",
  },
  {
    name: "KGM Казань",
    city: "Казань",
    address: "ул. Петербургская, 50",
    login: "kazan",
    pin: "3456",
  },
  {
    name: "KGM Екатеринбург",
    city: "Екатеринбург",
    address: "ул. Машиностроителей, 19",
    login: "ekb",
    pin: "4567",
  },
  {
    name: "KGM Новосибирск",
    city: "Новосибирск",
    address: "ул. Фрунзе, 88",
    login: "nsk",
    pin: "5678",
  },
];

async function main() {
  for (const dealer of dealers) {
    const pinHash = await bcrypt.hash(dealer.pin, 10);
    await prisma.dealer.upsert({
      where: { login: dealer.login },
      update: {
        name: dealer.name,
        city: dealer.city,
        address: dealer.address,
        pinHash,
      },
      create: {
        name: dealer.name,
        city: dealer.city,
        address: dealer.address,
        login: dealer.login,
        pinHash,
      },
    });
  }

  console.log(`Seeded ${dealers.length} dealers`);
  console.log("Demo credentials: login + 4-digit PIN (e.g. moscow / 1234)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
