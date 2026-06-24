import * as crypto from "node:crypto";
import bcrypt from "bcryptjs";

const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function transliterate(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((char) => TRANSLIT_MAP[char] ?? char)
    .join("");
}

export function slugifyLogin(name: string) {
  return transliterate(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
}

export function generatePin() {
  return String(crypto.randomInt(1000, 10000));
}

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, 10);
}

export function isValidPin(pin: string) {
  return /^\d{4}$/.test(pin);
}

export function normalizeLogin(login: string) {
  return login.trim().toLowerCase();
}
