"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowButton } from "@/components/landing/ArrowButton";
import { SectionLabel } from "@/components/landing/SectionLabel";
import type { DealerOption } from "@/lib/dealers";
import { LANDING_IMAGES } from "@/lib/landing-assets";
import { applyPhoneMaskKeyDown, isValidPhone, maskPhoneInput } from "@/lib/phone";
import { isValidEmail } from "@/lib/validation";

type RegistrationResult = {
  token: string;
  scanUrl: string;
  qrDataUrl: string;
  dealer: { name: string; city: string };
  createdAt: string;
  isDuplicate?: boolean;
  message?: string;
};

type RegistrationFormProps = {
  dealers: DealerOption[];
  testDrivePeriodLabel: string;
};

const fieldClassName = "field-input";
const selectClassName = "field-select";
const fieldLabelClassName =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-muted sm:mb-2 sm:text-[13px] md:text-[15px]";

const checkboxLabelClassName =
  "flex items-start gap-3 text-sm leading-snug text-muted sm:gap-4 sm:text-base md:text-lg";

const checkboxInputClassName =
  "mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-border sm:mt-1 sm:h-6 sm:w-6";

export function RegistrationForm({
  dealers,
  testDrivePeriodLabel,
}: RegistrationFormProps) {
  const registrationBenefits = useMemo(
    () => [
      {
        icon: LANDING_IMAGES.registerBenefit1,
        text: "Регистрация занимает меньше минуты",
      },
      {
        icon: LANDING_IMAGES.registerBenefit2,
        text: "Получите QR-код сразу после заполнения заявки",
      },
      {
        icon: LANDING_IMAGES.registerBenefit3,
        text: "Ваши данные в безопасности",
      },
      {
        icon: LANDING_IMAGES.registerBenefit4,
        text: testDrivePeriodLabel,
      },
    ],
    [testDrivePeriodLabel],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    dealerId: "",
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

    if (!isValidPhone(form.phone)) {
      setError("Укажите корректный телефон в формате +7 (999) 000-00-00");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Укажите корректный email");
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
      <section id="register" className="rounded-t-[40px] bg-brand pt-20 pb-16 sm:rounded-t-[80px] md:pt-28 md:pb-20">
        <div className="section-container">
          <div className="mx-auto max-w-xl rounded-[20px] bg-surface p-8 text-center sm:rounded-[50px] md:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-icon text-2xl text-brand">
              ✓
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-brand sm:text-3xl">
              {result.isDuplicate
                ? "Вы уже зарегистрированы"
                : "Вы записаны на тест-драйв!"}
            </h2>
            <p className="mt-2 text-base text-muted sm:text-lg">
              {result.isDuplicate
                ? "Ваш QR-код"
                : `Покажите QR-код дилеру при визите в ${result.dealer.name}, ${result.dealer.city}`}
            </p>
            <p className="mt-2 text-sm text-muted sm:text-base">
              {result.isDuplicate
                ? `Письмо с QR-кодом было отправлено на ${form.email} при регистрации`
                : `QR-код также отправлен на почту ${form.email}`}
            </p>

            <div className="mt-6 inline-block rounded-[16px] border border-border bg-white p-4 sm:rounded-[28px]">
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
    <section id="register" className="rounded-t-[40px] bg-brand pt-20 pb-16 sm:rounded-t-[80px] md:pt-28 md:pb-20">
      <div className="section-container">
        <SectionLabel variant="on-brand">Регистрация</SectionLabel>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-[54px] md:leading-[1.1]">
          Запишитесь сейчас
          <br />
          и получите QR-код
        </h2>

        <div className="mt-10 rounded-[32px] bg-brand-soft p-5 sm:rounded-[60px] sm:p-6 md:mt-12 md:p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_1.08fr] md:items-stretch md:gap-6 lg:gap-8">
            <div className="flex h-full min-h-0 flex-col text-white md:py-2 md:pr-2">
              <div className="shrink-0">
                <p className="px-5 text-2xl font-semibold leading-snug sm:px-6 sm:text-[32px] md:px-7 md:text-[40px] md:leading-[1.2]">
                  Тест-драйв KGM Torres —{" "}
                  <span className="text-[#BA99FF]">шанс выиграть</span> садовую
                  технику Champion
                </p>
              </div>

              <div className="mt-auto flex flex-col">
                <p className="mb-8 px-5 text-[15px] leading-relaxed text-white/45 sm:px-6 md:px-7 md:text-base">
                  Пройдите тест-драйв KGM Torres
                  <br />
                  и выиграйте садовую технику Champion
                </p>

                <div className="rounded-[20px] bg-white/5 p-5 sm:rounded-[50px] sm:p-6 md:p-7">
                  <ul className="space-y-4">
                    {registrationBenefits.map((benefit) => (
                      <li key={benefit.text} className="flex items-center gap-3 text-base text-white md:text-lg">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(84,40,143,0.8)]">
                          <Image
                            src={benefit.icon}
                            alt=""
                            width={18}
                            height={18}
                            aria-hidden
                          />
                        </span>
                        {benefit.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="h-full rounded-[20px] bg-surface p-5 sm:rounded-[50px] sm:p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
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
                    className={selectClassName}
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
                    className={selectClassName}
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
              </div>

              <label className={checkboxLabelClassName}>
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
                  className={checkboxInputClassName}
                />
                <span>
                  Я соглашаюсь с обработкой персональных данных в соответствии с{" "}
                  <Link href="/privacy" className="text-brand hover:underline">
                    Политикой конфиденциальности
                  </Link>
                </span>
              </label>

              <label className={checkboxLabelClassName}>
                <input
                  type="checkbox"
                  checked={form.consentMarketing}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      consentMarketing: e.target.checked,
                    }))
                  }
                  className={checkboxInputClassName}
                />
                <span>
                  Я согласен на получение рекламной и информационной рассылки
                  (email, SMS) от АО «РЭКС Моторс»
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

              <ArrowButton
                type="submit"
                disabled={loading}
                className="text-base sm:text-[19px]"
              >
                {loading ? (
                  "Отправка..."
                ) : (
                  <>
                    <span className="min-[501px]:hidden">Отправить</span>
                    <span className="hidden min-[501px]:inline">
                      Записаться и получить QR-код
                    </span>
                  </>
                )}
              </ArrowButton>
            </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
