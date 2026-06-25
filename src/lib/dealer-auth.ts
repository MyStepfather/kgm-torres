import { cookies } from "next/headers";
import { useSecureCookies } from "@/lib/secure-cookies";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const DEALER_SESSION_COOKIE = "dealer_session";

export async function verifyDealerCredentials(login: string, pin: string) {
  const dealer = await prisma.dealer.findUnique({ where: { login } });
  if (!dealer) return null;

  const isValid = await bcrypt.compare(pin, dealer.pinHash);
  if (!isValid) return null;

  return dealer;
}

export async function getDealerFromSession() {
  const cookieStore = await cookies();
  const dealerId = cookieStore.get(DEALER_SESSION_COOKIE)?.value;
  if (!dealerId) return null;

  return prisma.dealer.findUnique({ where: { id: dealerId } });
}

export async function setDealerSession(dealerId: string) {
  const cookieStore = await cookies();
  cookieStore.set(DEALER_SESSION_COOKIE, dealerId, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearDealerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEALER_SESSION_COOKIE);
}
