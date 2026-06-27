"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type RegistrationData = {
  name: string;
  phone: string;
  email: string;
  city: string;
  testDriveDate: string;
  createdAt: string;
  isActivated: boolean;
  activatedAt: string | null;
  dealer: {
    name: string;
    city: string;
    address: string | null;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function DealerScanPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [login, setLogin] = useState("");
  const [pin, setPin] = useState("");
  const [authStatus, setAuthStatus] = useState<
    "checking" | "guest" | "authenticated"
  >("checking");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [registration, setRegistration] = useState<RegistrationData | null>(
    null,
  );
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRegistration = useCallback(async () => {
    setLoadingRegistration(true);
    setError("");

    try {
      const response = await fetch(`/api/dealer/registration/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось загрузить заявку");
      }

      setRegistration(data);
    } catch (loadError) {
      setRegistration(null);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Не удалось загрузить заявку",
      );
    } finally {
      setLoadingRegistration(false);
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const [tokenResponse, sessionResponse] = await Promise.all([
        fetch(`/api/dealer/token/${token}/check`),
        fetch("/api/dealer/login"),
      ]);

      if (cancelled) return;

      setTokenValid(tokenResponse.ok);

      if (!tokenResponse.ok) {
        setAuthStatus("guest");
        return;
      }

      const session = await sessionResponse.json();
      if (session.authenticated) {
        setAuthStatus("authenticated");
        await loadRegistration();
      } else {
        setAuthStatus("guest");
      }
    }

    init().catch(() => {
      if (!cancelled) {
        setTokenValid(false);
        setAuthStatus("guest");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token, loadRegistration]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoggingIn(true);

    try {
      const response = await fetch("/api/dealer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, pin }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Ошибка входа");
      }

      setAuthStatus("authenticated");
      await loadRegistration();
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Ошибка входа",
      );
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleActivate() {
    setError("");
    setSuccess("");
    setActivating(true);

    try {
      const response = await fetch(`/api/dealer/activate/${token}`, {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось подтвердить тест-драйв");
      }

      setSuccess("Тест-драйв подтверждён!");
      await loadRegistration();
    } catch (activateError) {
      setError(
        activateError instanceof Error
          ? activateError.message
          : "Не удалось подтвердить тест-драйв",
      );
    } finally {
      setActivating(false);
    }
  }

  const showLogin = authStatus === "guest" && tokenValid === true;
  const showRegistration =
    authStatus === "authenticated" && registration !== null;
  const showRegistrationLoading =
    authStatus === "authenticated" && loadingRegistration && !registration;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="section-container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-logo">KGM</div>
            <div>
              <p className="text-sm font-semibold">Кабинет дилера</p>
              <p className="text-xs text-muted">Участник тест-драйва</p>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-12">
        {authStatus === "checking" || tokenValid === null ? (
          <div className="mx-auto max-w-md text-center text-muted">
            Проверка QR-кода...
          </div>
        ) : tokenValid === false ? (
          <div className="mx-auto max-w-md card-surface p-8 text-center">
            <h1 className="text-xl font-bold">QR-код не найден</h1>
            <p className="mt-2 text-sm text-muted">
              Ссылка недействительна или участник не зарегистрирован. Попросите
              клиента показать QR-код с лендинга KGM Torres.
            </p>
          </div>
        ) : showLogin ? (
          <div className="mx-auto max-w-md card-surface p-8">
            <h1 className="text-2xl font-bold">Вход для дилера</h1>
            <p className="mt-2 text-sm text-muted">
              QR-код участника распознан. Войдите с логином и PIN — после входа
              сразу откроются данные клиента.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-muted">Логин</span>
                <input
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="app-field"
                  autoComplete="username"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-muted">
                  PIN (4 цифры)
                </span>
                <input
                  required
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="app-field tracking-[0.5em]"
                  placeholder="••••"
                  autoComplete="current-password"
                />
              </label>

              {error && (
                <p className="alert-error">{error}</p>
              )}

              <button
                type="submit"
                disabled={loggingIn}
                className="btn-primary w-full disabled:opacity-60"
              >
                {loggingIn ? "Вход..." : "Войти и открыть заявку"}
              </button>
            </form>
          </div>
        ) : showRegistrationLoading ? (
          <div className="mx-auto max-w-md text-center text-muted">
            Загрузка данных участника...
          </div>
        ) : showRegistration ? (
          <div className="mx-auto max-w-2xl card-surface p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="brand-badge">Данные участника</p>
                <h1 className="mt-2 text-2xl font-bold">{registration.name}</h1>
              </div>
              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold ${
                  registration.isActivated ? "badge-success" : "badge-warning"
                }`}
              >
                {registration.isActivated
                  ? "Тест-драйв пройден"
                  : "Ожидает подтверждения"}
              </span>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="app-panel">
                <dt className="text-xs text-muted">Телефон</dt>
                <dd className="mt-1 font-medium">{registration.phone}</dd>
              </div>
              <div className="app-panel">
                <dt className="text-xs text-muted">Email</dt>
                <dd className="mt-1 font-medium">{registration.email}</dd>
              </div>
              <div className="app-panel">
                <dt className="text-xs text-muted">Город клиента</dt>
                <dd className="mt-1 font-medium">{registration.city}</dd>
              </div>
              <div className="app-panel">
                <dt className="text-xs text-muted">Дилерский центр</dt>
                <dd className="mt-1 font-medium">
                  {registration.dealer.name}, {registration.dealer.city}
                </dd>
                {registration.dealer.address && (
                  <dd className="mt-1 text-sm text-muted">
                    {registration.dealer.address}
                  </dd>
                )}
              </div>
              <div className="app-panel sm:col-span-2">
                <dt className="text-xs text-muted">Дата регистрации</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(registration.createdAt)}
                </dd>
              </div>
              {registration.activatedAt && (
                <div className="alert-success sm:col-span-2">
                  <dt className="text-xs font-semibold text-green-800">Дата подтверждения</dt>
                  <dd className="mt-1 font-medium text-green-900">
                    {formatDate(registration.activatedAt)}
                  </dd>
                </div>
              )}
            </dl>

            {error && (
              <p className="mt-6 alert-error">{error}</p>
            )}

            {success && (
              <p className="mt-6 alert-success">{success}</p>
            )}

            {!registration.isActivated && (
              <button
                type="button"
                onClick={handleActivate}
                disabled={activating}
                className="btn-primary mt-8 w-full disabled:opacity-60"
              >
                {activating ? "Подтверждение..." : "Подтвердить тест-драйв"}
              </button>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-md card-surface p-8 text-center">
            <p className="text-muted">
              {error || "Не удалось загрузить данные участника"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
