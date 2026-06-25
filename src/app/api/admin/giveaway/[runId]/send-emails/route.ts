import { NextResponse } from "next/server";
import { sendWinnerEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ runId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { runId } = await context.params;

    const run = await prisma.giveawayRun.findUnique({
      where: { id: runId },
      include: {
        winners: {
          where: { emailSent: false },
          orderBy: { place: "asc" },
          include: {
            registration: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!run) {
      return NextResponse.json({ error: "Розыгрыш не найден" }, { status: 404 });
    }

    if (!run.winners.length) {
      return NextResponse.json(
        { error: "Все письма победителям уже отправлены" },
        { status: 400 },
      );
    }

    const results = await Promise.all(
      run.winners.map(async (winner) => {
        let emailSent = false;
        let emailSentAt: Date | null = null;

        try {
          const result = await sendWinnerEmail({
            name: winner.registration.name,
            email: winner.registration.email,
            place: winner.place,
          });
          emailSent = result.ok;
          emailSentAt = emailSent ? new Date() : null;
        } catch (emailError) {
          console.error("Winner email error:", emailError);
        }

        if (emailSent) {
          await prisma.giveawayWinner.update({
            where: { id: winner.id },
            data: { emailSent: true, emailSentAt },
          });
        }

        return {
          place: winner.place,
          email: winner.registration.email,
          emailSent,
        };
      }),
    );

    const sentCount = results.filter((item) => item.emailSent).length;

    if (sentCount === 0) {
      return NextResponse.json(
        { error: "Не удалось отправить письма. Проверьте настройки SMTP." },
        { status: 500 },
      );
    }

    const winners = await prisma.giveawayWinner.findMany({
      where: { runId },
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
    });

    return NextResponse.json({
      runId,
      sentCount,
      winners: winners.map((winner) => ({
        place: winner.place,
        emailSent: winner.emailSent,
        name: winner.registration.name,
        phone: winner.registration.phone,
        email: winner.registration.email,
        city: winner.registration.city,
        dealer: winner.registration.dealer,
      })),
    });
  } catch (error) {
    console.error("Giveaway send emails error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить письма победителям" },
      { status: 500 },
    );
  }
}
