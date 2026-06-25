"use client";

import { useMemo, useState } from "react";
import { SectionLabel } from "@/components/landing/SectionLabel";
import { DatePicker } from "@/components/ui/DatePicker";
import { GIVEAWAY_DATE } from "@/lib/constants";
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

const fieldClassName = "field-input";
const fieldLabelClassName =
  "mb-2 block text-[15px] font-medium uppercase tracking-[0.08em] text-muted";

const benefits = [
  "Регистрация занимает меньше минуты",
  "QR-код придёт сразу после заявки",
  "Ваши данные в безопасности",
  `Розыгрыш — ${GIVEAWAY_DATE}`,
];

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
      <section id="register" className="rounded-t-[80px] bg-brand py-16 lg:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-xl rounded-[50px] bg-surface p-8 text-center lg:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-icon text-2xl text-brand">
              ✓
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-brand">
              {result.isDuplicate
                ? "Вы уже зарегистрированы"
                : "Вы записаны на тест-драйв!"}
            </h2>
            <p className="mt-2 text-lg text-muted">
              {result.isDuplicate
                ? "Ваш QR-код"
                : `Покажите QR-код дилеру при визите в ${result.dealer.name}, ${result.dealer.city}`}
            </p>
            {result.testDriveDate && (
              <p className="mt-2 text-base font-semibold text-brand">
                Дата тест-драйва: {formatTestDriveDate(result.testDriveDate)}
              </p>
            )}

            <div className="mt-6 inline-block rounded-[28px] border border-border bg-white p-4">
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
    <section id="register" className="rounded-t-[80px] bg-brand py-16 lg:py-20">
      <div className="section-container">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="text-white">
            <SectionLabel variant="on-brand">Регистрация</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[54px] lg:leading-[1.1]">
              Получите QR-код
              <br />
              и запишитесь сейчас
            </h2>

            <div className="mt-10 rounded-[60px] bg-brand-soft p-6 lg:p-8">
              <p className="text-2xl font-semibold leading-snug sm:text-[32px] lg:text-[40px] lg:leading-[1.2]">
                Один тест-драйв —{" "}
                <span className="text-accent-light">шанс выиграть</span> садовую
                технику Champion
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-white/45">
                Пройдите тест-драйв KGM Torres и выиграйте садовую технику Champion
              </p>

              <div className="mt-8 rounded-[50px] bg-white/5 p-6">
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-lg text-white">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(84,40,143,0.8)]">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[50px] bg-surface p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label htmlFor="name" className={fieldLabelClassName}>
                    Имя
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={fieldClassName}
                    placeholder="Александр"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={fieldLabelClassName}>
                    Телефон
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
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={fieldLabelClassName}>
                    Email
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
                    placeholder="alex@mail.ru"
                  />
                </div>

                <div>
                  <label htmlFor="city" className={fieldLabelClassName}>
                    Город
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
                  <label htmlFor="dealer" className={fieldLabelClassName}>
                    Выбор дилера
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
                  <label htmlFor="testDriveDate" className={fieldLabelClassName}>
                    Дата тест-драйва
                  </label>
                  <DatePicker
                    id="testDriveDate"
                    required
                    schedule={testDriveSchedule}
                    value={form.testDriveDate}
                    onChange={(testDriveDate) =>
                      setForm((prev) => ({ ...prev, testDriveDate }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <label className="flex items-start gap-4 text-lg text-muted">
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
                  className="mt-1 h-6 w-6 rounded-md border-2 border-border"
                />
                <span>
                  Я соглашаюсь с{" "}
                  <span className="text-brand">обработкой персональных данных</span>{" "}
                  в соответствии с Политикой конфиденциальности
                </span>
              </label>

              <label className="flex items-start gap-4 text-lg text-muted">
                <input
                  type="checkbox"
                  checked={form.consentMarketing}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      consentMarketing: e.target.checked,
                    }))
                  }
                  className="mt-1 h-6 w-6 rounded-md border-2 border-border"
                />
                <span>
                  Я согласен на получение рекламной и информационной рассылки
                  (email, SMS, push) от АО «РЭКС Моторс»
                </span>
              </label>

              {dealers.length === 0 && (
                <p className="rounded-[20px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Список дилеров пуст. Запустите базу данных и импорт:{" "}
                  <code className="text-xs">npm run db:up && npm run db:import-dealers</code>
                </p>
              )}

              {error && (
                <p className="rounded-[20px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-form">
                {loading ? "Отправка..." : "Получить QR-код и записаться"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
