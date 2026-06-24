import nodemailer from "nodemailer";
import { PRIZES } from "@/lib/constants";

type WinnerEmailPayload = {
  name: string;
  email: string;
  place: number;
};

function getPrizeTitle(place: number) {
  const prize = PRIZES.find((item) => item.place === place);
  return prize ? `${prize.title} ${prize.model}` : "приз от Champion";
}

function buildWinnerEmailHtml(payload: WinnerEmailPayload) {
  const prizeTitle = getPrizeTitle(payload.place);

  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h1 style="color: #1a3a2f;">Поздравляем, ${payload.name}!</h1>
      <p>Вы стали победителем розыгрыша садовой техники Champion в рамках акции KGM Torres.</p>
      <p><strong>Ваш приз (${payload.place} место):</strong> ${prizeTitle}</p>
      <p>Наш менеджер свяжется с вами по указанным контактным данным для уточнения деталей вручения приза.</p>
      <p style="color: #64748b; font-size: 14px;">С уважением,<br/>Команда KGM Torres</p>
    </div>
  `;
}

export async function sendWinnerEmail(payload: WinnerEmailPayload) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? "noreply@kgm-torres.ru";

  const subject = `Поздравляем! Вы выиграли в розыгрыше Champion — ${payload.place} место`;
  const html = buildWinnerEmailHtml(payload);

  if (!host) {
    console.log("[email:dev] Winner email skipped (SMTP not configured)", {
      to: payload.email,
      subject,
      place: payload.place,
    });
    return { ok: true, dev: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  await transporter.sendMail({
    from,
    to: payload.email,
    subject,
    html,
  });

  return { ok: true, dev: false };
}
