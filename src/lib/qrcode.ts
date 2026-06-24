import QRCode from "qrcode";

export async function buildRegistrationQr(token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const scanUrl = `${appUrl}/dealer/scan/${token}`;
  const qrDataUrl = await QRCode.toDataURL(scanUrl, {
    width: 320,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return { scanUrl, qrDataUrl };
}

export function extractTokenFromQr(text: string) {
  const trimmed = text.trim();
  const urlMatch = trimmed.match(/\/dealer\/scan\/([a-f0-9-]+)/i);
  if (urlMatch) {
    return urlMatch[1];
  }

  const uuidMatch = trimmed.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
  if (uuidMatch) {
    return uuidMatch[0];
  }

  return trimmed;
}
