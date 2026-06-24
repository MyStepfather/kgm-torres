import { prisma } from "@/lib/prisma";

export type DealerOption = {
  id: string;
  name: string;
  city: string;
  address: string | null;
};

export async function getDealers(): Promise<DealerOption[]> {
  return prisma.dealer.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      city: true,
      address: true,
    },
  });
}
