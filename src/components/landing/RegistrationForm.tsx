"use client";

import { useMemo, useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import type { DealerOption } from "@/lib/dealers";
import { formatTestDriveDate } from "@/lib/dates";
import { applyPhoneMaskKeyDown, isValidPhone, maskPhoneInput } from "@/lib/phone";
import { isValidTestDriveDate, type TestDriveSchedule } from "@/lib/test-drive-schedule";
import { isValidEmail } from "@/lib/validation";

type RegistrationResult = {
  token: string;
  scanUrl: string;
  qrDataUrl: string;
  dealer: { name: string; city: string };
  testDriveDate?: string;
  createdAt: string;
  isDuplicate?: boolean;
  message?: string;
};

type RegistrationFormProps = {
  dealers: DealerOption[];
  testDriveSchedule: TestDriveSchedule;
};

const fieldClassName =
  "w-full rounded-xl border border-white/10 bg-background px-4 py-3 outline-none focus:border-accent";

export function RegistrationForm({
  dealers,
  testDriveSchedule,
}: RegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    dealerId: "",
    testDriveDate: "",
    consentPersonal: false,
    consentMarketing: false,
  });

  const cities = useMemo(
    () =>
      [...new Set(dealers.map((dealer) => dealer.city.trim()))].sort((a, b) =>
        a.localeCompare(b, "ru"),
      ),
    [dealers],
  );

  const dealersInCity = useMemo(() => {
    if (!form.city) return [];
    return dealers.filter((dealer) => dealer.city.trim() === form.city);
  }, [dealers, form.city]);

  function handleCityChange(city: string) {
    setForm((prev) => ({ ...prev, city, dealerId: "" }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.city) {
      setError("Выберите город");
      return;
    }

    if (!form.dealerId) {
      setError("Выберите дилерский центр");
      return;
    }

    if (!form.testDriveDate) {
      setError("Выберите дату тест-драйва");
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError("Укажите корректный телефон в формате +7 (999) 000-00-00");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Укажите корректный email");
      return;
    }

    if (!isValidTestDriveDate(form.testDriveDate, testDriveSchedule)) {
      setError("Выберите доступную дату тест-драйва");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Ошибка регистрации");
      }

      setResult(data);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ошибка регистрации",
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadQr() {
    if (!result?.qrDataUrl) return;
    const link = document.createElement("a");
    link.href = result.qrDataUrl;
    link.download = `kgm-torres-qr-${result.token.slice(0, 8)}.png`;
    link.click();
  }

  if (result) {
    return (
      <section id="register" className="py-24">
        <div className="section-container">
          <div className="mx-auto max-w-xl card-surface p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-2xl text-green-400">
              ✓
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              {result.isDuplicate
                ? "Вы уже зарегистрированы"
                : "Вы записаны на тест-драйв!"}
            </h2>
            <p className="mt-2 text-muted">
              {result.isDuplicate
                ? "Ваш QR-код"
                : `Покажите QR-код дилеру при визите в ${result.dealer.name}, ${result.dealer.city}`}
            </p>
            {result.testDriveDate && (
              <p className="mt-2 text-sm text-accent">
                Дата тест-драйва: {formatTestDriveDate(result.testDriveDate)}
              </p>
            )}

            <div className="mt-4 inline-block rounded-2xl border border-white/10 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.qrDataUrl}
                alt="QR-код участника"
                className="h-64 w-64"
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={downloadQr} className="btn-primary">
                Скачать QR
              </button>
              <a href="#how" className="btn-secondary">
                Что дальше?
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24">
      <div className="section-container">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Регистрация
            </p>
            <h2 className="mt-3 text-3xl font-bold">Получите QR-код и запишитесь</h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 card-surface space-y-5 p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="mb-2 block text-sm text-muted">
                  Имя *
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={fieldClassName}
                  placeholder="Иван"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm text-muted">
                  Телефон *
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onKeyDown={(e) => {
                    if (e.key !== "Backspace" && e.key !== "Delete") {
                      return;
                    }

                    const next = applyPhoneMaskKeyDown(
                      form.phone,
                      e.key,
                      e.currentTarget.selectionStart ?? 0,
                      e.currentTarget.selectionEnd ?? 0,
                    );

                    if (next === null) {
                      return;
                    }

                    e.preventDefault();
                    setForm((prev) => ({ ...prev, phone: next }));
                  }}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: maskPhoneInput(e.target.value, prev.phone),
                    }))
                  }
                  className={fieldClassName}
                  placeholder="+7 (999) 000-00-00"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-muted">
                  Email *
                </label>
                <input
                  id="email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={fieldClassName}
                  placeholder="email@example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className="mb-2 block text-sm text-muted">
                  Город *
                </label>
                <select
                  id="city"
                  required
                  disabled={cities.length === 0}
                  value={form.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={fieldClassName}
                >
                  <option value="">Выберите город</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="dealer" className="mb-2 block text-sm text-muted">
                  Дилерский центр *
                </label>
                <select
                  id="dealer"
                  key={form.city || "no-city"}
                  required
                  disabled={!form.city}
                  value={form.dealerId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dealerId: e.target.value,
                    }))
                  }
                  className={fieldClassName}
                >
                  <option value="">
                    {!form.city
                      ? "Сначала выберите город"
                      : dealersInCity.length === 0
                        ? "Нет дилеров в выбранном городе"
                        : "Выберите дилерский центр"}
                  </option>
                  {dealersInCity.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="testDriveDate" className="mb-2 block text-sm text-muted">
                  Дата тест-драйва *
                </label>
                <DatePicker
                  id="testDriveDate"
                  required
                  schedule={testDriveSchedule}
                  value={form.testDriveDate}
                  onChange={(testDriveDate) =>
                    setForm((prev) => ({ ...prev, testDriveDate }))
                  }
                />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <input
                required
                type="checkbox"
                checked={form.consentPersonal}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    consentPersonal: e.target.checked,
                  }))
                }
                className="mt-1"
              />
              <span className="text-muted">
                Согласие на обработку персональных данных *
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.consentMarketing}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    consentMarketing: e.target.checked,
                  }))
                }
                className="mt-1"
              />
              <span className="text-muted">
                Согласие на получение рекламной информации
              </span>
            </label>

            {dealers.length === 0 && (
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Список дилеров пуст. Запустите базу данных и импорт:{" "}
                <code className="text-xs">npm run db:up && npm run db:import-dealers</code>
              </p>
            )}

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Отправка..." : "Получить QR-код и записаться"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
