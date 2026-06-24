function extractPhoneDigits(raw: string) {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.length > 0 && !digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  return digits.slice(0, 11);
}

function formatPhoneDigits(digits: string) {
  if (digits.length === 0) return "";
  if (digits.length <= 1) return "+7";

  const local = digits.slice(1);
  let result = `+7 (${local.slice(0, 3)}`;

  if (local.length < 3) {
    return result;
  }

  result += `) ${local.slice(3, 6)}`;

  if (local.length < 6) {
    return result;
  }

  result += `-${local.slice(6, 8)}`;

  if (local.length < 8) {
    return result;
  }

  result += `-${local.slice(8, 10)}`;
  return result;
}

export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("8") && digits.length === 11) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    digits = `7${digits}`;
  }

  if (!/^7\d{10}$/.test(digits)) {
    return null;
  }

  return digits;
}

export function formatPhone(normalized: string) {
  const local = normalized.slice(1);
  return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8, 10)}`;
}

export function maskPhoneInput(raw: string, previousFormatted = "") {
  let digits = extractPhoneDigits(raw);

  if (previousFormatted) {
    const prevDigits = previousFormatted.replace(/\D/g, "");
    if (digits.length === prevDigits.length && raw.length < previousFormatted.length) {
      digits = digits.slice(0, -1);
    }
  }

  return formatPhoneDigits(digits);
}

function countDigitsBefore(value: string, index: number) {
  return value.slice(0, index).replace(/\D/g, "").length;
}

export function applyPhoneMaskKeyDown(
  value: string,
  key: "Backspace" | "Delete",
  selectionStart: number,
  selectionEnd: number,
) {
  if (selectionStart !== selectionEnd) {
    return null;
  }

  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  if (key === "Backspace" && selectionStart > 0) {
    const charBefore = value[selectionStart - 1];
    if (!/\D/.test(charBefore)) {
      return null;
    }

    const digitIndex = countDigitsBefore(value, selectionStart);
    if (digitIndex === 0) {
      return "";
    }

    const newDigits = digits.slice(0, digitIndex - 1) + digits.slice(digitIndex);
    return maskPhoneInput(newDigits);
  }

  if (key === "Delete" && selectionStart < value.length) {
    const charAt = value[selectionStart];
    if (!/\D/.test(charAt)) {
      return null;
    }

    const digitIndex = countDigitsBefore(value, selectionStart);
    if (digitIndex >= digits.length) {
      return null;
    }

    const newDigits = digits.slice(0, digitIndex) + digits.slice(digitIndex + 1);
    return maskPhoneInput(newDigits);
  }

  return null;
}

export function isValidPhone(input: string) {
  return normalizePhone(input) !== null;
}
