export function useSecureCookies() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    return appUrl.startsWith("https://");
  }

  return false;
}
