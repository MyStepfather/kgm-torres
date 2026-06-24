import { formatTestDriveDate } from "@/lib/dates";
import type { serializeRegistration } from "@/lib/admin-registration-filters";

type RegistrationExportRow = ReturnType<typeof serializeRegistration>;

function formatDateTime(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function registrationToExportRow(
  registration: RegistrationExportRow,
  index: number,
) {
  return {
    "№": index + 1,
    Имя: registration.name,
    Телефон: registration.phone,
    Email: registration.email,
    Город: registration.city,
    Дилер: registration.dealer.name,
    "Город дилера": registration.dealer.city,
    "Дата тест-драйва": formatTestDriveDate(registration.testDriveDate),
    Статус: registration.isActivated ? "Тест-драйв пройден" : "Ожидает",
    "Дата регистрации": formatDateTime(registration.createdAt),
    "Дата активации": formatDateTime(registration.activatedAt),
  };
}
