import { NextResponse } from "next/server";
import { sendWinnerEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const WINNER_COUNT = 3;

function pickRandomWinners<T>(items: T[], count: number) {
  const pool = [...items];
  const winners: T[] = [];

  while (winners.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    winners.push(pool.splice(index, 1)[0]);
  }

  return winners;
}

export async function GET() {
  const [runs, eligibleCount] = await Promise.all([
    prisma.giveawayRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        winners: {
          orderBy: { place: "asc" },
          include: {
            registration: {
              select: {
                name: true,
                phone: true,
                email: true,
                city: true,
                dealer: {
                  select: { name: true, city: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.registration.count({
      where: {
        isActivated: true,
        giveawayWinner: null,
      },
    }),
  ]);

  return NextResponse.json({ runs, eligibleCount });
}

export async function POST() {
  try {
    const eligible = await prisma.registration.findMany({
      where: {
        isActivated: true,
        giveawayWinner: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (eligible.length === 0) {
      return NextResponse.json(
        { error: "Нет участников, прошедших тест-драйв" },
        { status: 400 },
      );
    }

    const selected = pickRandomWinners(eligible, WINNER_COUNT);
    const run = await prisma.giveawayRun.create({ data: {} });

    const winners = await Promise.all(
      selected.map(async (registration, index) => {
        const place = index + 1;
        let emailSent = false;
        let emailSentAt: Date | null = null;

        try {
          const result = await sendWinnerEmail({
            name: registration.name,
            email: registration.email,
            place,
          });
          emailSent = result.ok;
          emailSentAt = emailSent ? new Date() : null;
        } catch (emailError) {
          console.error("Winner email error:", emailError);
        }

        return prisma.giveawayWinner.create({
          data: {
            runId: run.id,
            registrationId: registration.id,
            place,
            emailSent,
            emailSentAt,
          },
          include: {
            registration: {
              select: {
                name: true,
                phone: true,
                email: true,
                city: true,
                dealer: {
                  select: { name: true, city: true },
                },
              },
            },
          },
        });
      }),
    );

    const remaining = await prisma.registration.count({
      where: {
        isActivated: true,
        giveawayWinner: null,
      },
    });

    return NextResponse.json({
      runId: run.id,
      createdAt: run.createdAt,
      winners: winners.map((winner) => ({
        place: winner.place,
        emailSent: winner.emailSent,
        name: winner.registration.name,
        phone: winner.registration.phone,
        email: winner.registration.email,
        city: winner.registration.city,
        dealer: winner.registration.dealer,
      })),
      eligibleCount: remaining,
    });
  } catch (error) {
    console.error("Giveaway run error:", error);
    return NextResponse.json(
      { error: "Не удалось провести розыгрыш" },
      { status: 500 },
    );
  }
}
