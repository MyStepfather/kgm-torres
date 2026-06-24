import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";

export function getAdminSessionToken() {
  return (
    process.env.ADMIN_SESSION_TOKEN ??
    process.env.ADMIN_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "kgm-admin-dev-session"
  );
}

export function verifyAdminCredentials(login: string, password: string) {
  const expectedLogin = process.env.ADMIN_LOGIN?.trim();
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedLogin || !expectedPassword) {
    return false;
  }

  return login.trim() === expectedLogin && password === expectedPassword;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return token === getAdminSessionToken();
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, getAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
