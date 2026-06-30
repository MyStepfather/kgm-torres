import nodemailer from "nodemailer";
import { PRIZES } from "@/lib/constants";

type WinnerEmailPayload = {
  name: string;
  email: string;
  place: number;
};

type RegistrationEmailPayload = {
  name: string;
  email: string;
  phone: string;
  city: string;
  dealerName: string;
  dealerCity: string;
  scanUrl: string;
  qrDataUrl: string;
};

type DealerRegistrationEmailPayload = {
  dealerEmail: string;
  dealerName: string;
  dealerCity: string;
  participantName: string;
  participantPhone: string;
  participantEmail: string;
  participantCity: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? "KGM Torres <promo@kgm-drive.ru>";

  return { host, port, user, pass, from };
}

function createTransporter() {
  const { host, port, user, pass } = getSmtpConfig();

  if (!host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
}

async function sendMail(
  transporter: ReturnType<typeof nodemailer.createTransport> | null,
  options: {
    to: string;
    subject: string;
    html: string;
  },
) {
  const { from } = getSmtpConfig();

  if (!transporter) {
    console.log("[email:dev] Email skipped (SMTP not configured)", {
      to: options.to,
      subject: options.subject,
    });
    return { ok: true, dev: true };
  }

  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  return { ok: true, dev: false };
}

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
      <p style="color: #64748b; font-size: 14px;">С уважением,<br/>Команда KGM</p>
    </div>
  `;
}

function buildRegistrationEmailHtml(payload: RegistrationEmailPayload) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h1 style="color: #1a3a2f;">Спасибо за регистрацию, ${payload.name}!</h1>
      <p>Вы зарегистрированы на тест-драйв KGM Torres и участвуете в розыгрыше садовой техники Champion.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 15px;">
        <tr><td style="padding: 8px 0; color: #64748b;">Телефон</td><td style="padding: 8px 0;"><strong>${payload.phone}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><strong>${payload.email}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Город</td><td style="padding: 8px 0;"><strong>${payload.city}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Дилер</td><td style="padding: 8px 0;"><strong>${payload.dealerName}, ${payload.dealerCity}</strong></td></tr>
      </table>
      <p>Покажите QR-код дилеру при визите в салон:</p>
      <p style="text-align: center; margin: 24px 0;">
        <img src="${payload.qrDataUrl}" alt="QR-код участника" width="220" height="220" style="display: inline-block;" />
      </p>
      <p style="color: #64748b; font-size: 14px;">С уважением,<br/>Команда KGM</p>
    </div>
  `;
}

function buildDealerRegistrationEmailHtml(payload: DealerRegistrationEmailPayload) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h1 style="color: #1a3a2f;">Новая заявка на тест-драйв KGM Torres</h1>
      <p>Клиент записался на тест-драйв и выбрал ваш дилерский центр <strong>${payload.dealerName}, ${payload.dealerCity}</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 15px;">
        <tr><td style="padding: 8px 0; color: #64748b;">Имя</td><td style="padding: 8px 0;"><strong>${payload.participantName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Телефон</td><td style="padding: 8px 0;"><strong>${payload.participantPhone}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><strong>${payload.participantEmail}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Город</td><td style="padding: 8px 0;"><strong>${payload.participantCity}</strong></td></tr>
      </table>
      <p style="color: #64748b; font-size: 14px;">С уважением,<br/>Команда KGM</p>
    </div>
  `;
}

export async function sendWinnerEmail(payload: WinnerEmailPayload) {
  const transporter = createTransporter();
  const subject = `Поздравляем! Вы выиграли в розыгрыше Champion — ${payload.place} место`;

  return sendMail(transporter, {
    to: payload.email,
    subject,
    html: buildWinnerEmailHtml(payload),
  });
}

export async function sendRegistrationEmail(payload: RegistrationEmailPayload) {
  const transporter = createTransporter();
  const subject = "Регистрация на тест-драйв KGM Torres";

  return sendMail(transporter, {
    to: payload.email,
    subject,
    html: buildRegistrationEmailHtml(payload),
  });
}

export async function sendDealerRegistrationEmail(
  payload: DealerRegistrationEmailPayload,
) {
  const dealerEmail = payload.dealerEmail.trim();
  if (!dealerEmail) {
    return { ok: true, skipped: true };
  }

  const transporter = createTransporter();
  const subject = `Новая заявка на тест-драйв — ${payload.participantName}`;

  return sendMail(transporter, {
    to: dealerEmail,
    subject,
    html: buildDealerRegistrationEmailHtml(payload),
  });
}
