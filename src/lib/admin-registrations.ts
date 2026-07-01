import { prisma } from "@/lib/prisma";

export async function deleteRegistrations(ids: string[]) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];

  if (uniqueIds.length === 0) {
    throw new Error("Не выбраны регистрации");
  }

  const existing = await prisma.registration.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });

  if (existing.length === 0) {
    throw new Error("Регистрации не найдены");
  }

  const existingIds = existing.map((registration) => registration.id);

  await prisma.$transaction([
    prisma.giveawayWinner.deleteMany({
      where: { registrationId: { in: existingIds } },
    }),
    prisma.registration.deleteMany({
      where: { id: { in: existingIds } },
    }),
  ]);

  return existingIds.length;
}
