import { isValidEmail } from "@/lib/validation";

export function normalizeDealerEmails(values: string[]) {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim().toLowerCase())
    .filter((value) => {
      if (!value || seen.has(value)) {
        return false;
      }

      seen.add(value);
      return true;
    });
}

export function parseDealerEmailsInput(values: unknown) {
  if (!Array.isArray(values)) {
    return { error: "Укажите корректные email-адреса" } as const;
  }

  const emails = normalizeDealerEmails(
    values.filter((value): value is string => typeof value === "string"),
  );

  for (const email of emails) {
    if (!isValidEmail(email)) {
      return { error: `Некорректный email: ${email}` } as const;
    }
  }

  return { emails } as const;
}

export function formatDealerEmails(emails: string[]) {
  return emails.join(", ");
}
