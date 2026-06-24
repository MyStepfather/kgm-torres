import { statSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaClientMtime: number | undefined;
};

const GENERATED_CLIENT_MARKER = join(
  process.cwd(),
  "src/generated/prisma/internal/class.ts",
);

function getGeneratedClientMtime() {
  try {
    return statSync(GENERATED_CLIENT_MARKER).mtimeMs;
  } catch {
    return 0;
  }
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getPrismaClient() {
  const clientMtime = getGeneratedClientMtime();
  const cached = globalForPrisma.prisma;
  const cachedMtime = globalForPrisma.prismaClientMtime;

  if (cached && cachedMtime === clientMtime) {
    return cached;
  }

  if (cached) {
    void cached.$disconnect();
  }

  const prisma = createPrismaClient();
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaClientMtime = clientMtime;
  return prisma;
}

export const prisma = getPrismaClient();
