"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminLegalDocuments } from "@/components/admin/AdminLegalDocuments";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminStatistics } from "@/components/admin/AdminStatistics";
import { PRIZES } from "@/lib/constants";
import { isValidEmail } from "@/lib/validation";

type DealerRow = {
  id: string;
  name: string;
  city: string;
  address: string | null;
  login: string;
  createdAt: string;
  registrationsCount: number;
};

type RegistrationRow = {
  id: string;
  token: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  consentMarketing: boolean;
  testDriveDate: string;
  isActivated: boolean;
  activatedAt: string | null;
  createdAt: string;
  dealer: {
    name: string;
    city: string;
  };
};

type Tab = "dealers" | "registrations" | "statistics" | "create" | "giveaway" | "settings" | "documents";

type GiveawayWinnerRow = {
  place: number;
  emailSent: boolean;
  name: string;
  phone: string;
  email: string;
  city: string;
  dealer: { name: string; city: string };
};

type GiveawayRunRow = {
  id: string;
  createdAt: string;
  winners: Array<{
    place: number;
    emailSent: boolean;
    registration: {
      name: string;
      phone: string;
      email: string;
      city: string;
      dealer: { name: string; city: string };
    };
  }>;
};

const fieldClassName = "app-field";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function mapRunToLatestGiveaway(run: GiveawayRunRow) {
  return {
    runId: run.id,
    winners: run.winners.map((winner) => ({
      place: winner.place,
      emailSent: winner.emailSent,
      name: winner.registration.name,
      phone: winner.registration.phone,
      email: winner.registration.email,
      city: winner.registration.city,
      dealer: winner.registration.dealer,
    })),
  };
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dealers");
  const [dealers, setDealers] = useState<DealerRow[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createForm, setCreateForm] = useState({
    name: "",
    city: "",
    address: "",
    email: "",
    login: "",
    pin: "",
  });
  const [creating, setCreating] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    login: string;
    pin: string;
  } | null>(null);

  const [resetDealerId, setResetDealerId] = useState<string | null>(null);
  const [resetPin, setResetPin] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<{
    login: string;
    pin: string;
  } | null>(null);
  const [exportingPins, setExportingPins] = useState(false);

  const [giveawayRuns, setGiveawayRuns] = useState<GiveawayRunRow[]>([]);
  const [latestGiveaway, setLatestGiveaway] = useState<{
    runId: string;
    winners: GiveawayWinnerRow[];
  } | null>(null);
  const [runningGiveaway, setRunningGiveaway] = useState(false);
  const [sendingWinnerEmails, setSendingWinnerEmails] = useState(false);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [giveawayAvailable, setGiveawayAvailable] = useState(false);
  const [giveawayDateLabel, setGiveawayDateLabel] = useState("");

  const loadDealers = useCallback(async () => {
    const response = await fetch("/api/admin/dealers");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Не удалось загрузить дилеров");
    }
    setDealers(data);
  }, []);

  const loadRegistrations = useCallback(async () => {
    const response = await fetch("/api/admin/registrations");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Не удалось загрузить регистрации");
    }
    setRegistrations(data);
  }, []);

  const loadGiveaway = useCallback(async () => {
    const response = await fetch("/api/admin/giveaway");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Не удалось загрузить розыгрыши");
    }
    setGiveawayRuns(data.runs);
    setEligibleCount(data.eligibleCount);
    setGiveawayAvailable(Boolean(data.giveawayAvailable));
    setGiveawayDateLabel(data.giveawayDateLabel ?? "");
    setLatestGiveaway(
      data.runs.length > 0 ? mapRunToLatestGiveaway(data.runs[0]) : null,
    );
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadDealers(), loadRegistrations()]);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Ошибка загрузки",
      );
    } finally {
      setLoading(false);
    }
  }, [loadDealers, loadRegistrations]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (tab === "giveaway" && !loading) {
      loadGiveaway().catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Ошибка загрузки розыгрыша",
        );
      });
    }
  }, [tab, loading, loadGiveaway]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleCreateDealer(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    setCreatedCredentials(null);

    try {
      const email = createForm.email.trim().toLowerCase();
      if (email && !isValidEmail(email)) {
        setError("Укажите корректный email");
        setCreating(false);
        return;
      }

      const response = await fetch("/api/admin/dealers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          city: createForm.city,
          address: createForm.address || undefined,
          email: email || undefined,
          login: createForm.login || undefined,
          pin: createForm.pin || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось создать дилера");
      }

      setCreatedCredentials(data.credentials);
      setSuccess(`Дилер «${data.dealer.name}» создан`);
      setCreateForm({
        name: "",
        city: "",
        address: "",
        email: "",
        login: "",
        pin: "",
      });
      await loadDealers();
      setTab("dealers");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Не удалось создать дилера",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    if (!resetDealerId) return;

    setResetting(true);
    setError("");
    setSuccess("");
    setResetResult(null);

    try {
      const response = await fetch(
        `/api/admin/dealers/${resetDealerId}/password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pin: resetPin || undefined,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось сменить пароль");
      }

      setResetResult(data);
      setSuccess("Новый PIN сгенерирован");
      setResetPin("");
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Не удалось сменить пароль",
      );
    } finally {
      setResetting(false);
    }
  }

  async function handleExportResetPins() {
    const confirmed = window.confirm(
      "Будут сгенерированы новые PIN для всех дилеров. Старые PIN перестанут работать. Продолжить?",
    );
    if (!confirmed) {
      return;
    }

    setExportingPins(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/dealers/reset-pins-export", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Не удалось выгрузить PIN");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? "dealer-pins.xlsx";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      setSuccess("Новые PIN сгенерированы и выгружены в Excel");
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "Не удалось выгрузить PIN",
      );
    } finally {
      setExportingPins(false);
    }
  }

  async function handleRunGiveaway() {
    setRunningGiveaway(true);
    setError("");
    setSuccess("");
    setLatestGiveaway(null);

    try {
      const response = await fetch("/api/admin/giveaway", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось провести розыгрыш");
      }

      setLatestGiveaway({ runId: data.runId, winners: data.winners });
      setEligibleCount(data.eligibleCount);
      setSuccess(
        `Розыгрыш проведён. Выбрано победителей: ${data.winners.length}.`,
      );
      await loadGiveaway();
    } catch (giveawayError) {
      setError(
        giveawayError instanceof Error
          ? giveawayError.message
          : "Не удалось провести розыгрыш",
      );
    } finally {
      setRunningGiveaway(false);
    }
  }

  async function handleSendWinnerEmails() {
    if (!latestGiveaway) {
      return;
    }

    setSendingWinnerEmails(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/giveaway/${latestGiveaway.runId}/send-emails`,
        { method: "POST" },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось отправить письма");
      }

      setLatestGiveaway({
        runId: data.runId,
        winners: data.winners,
      });
      setSuccess(`Письма отправлены: ${data.sentCount}`);
      await loadGiveaway();
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Не удалось отправить письма",
      );
    } finally {
      setSendingWinnerEmails(false);
    }
  }

  const resetDealer = dealers.find((dealer) => dealer.id === resetDealerId);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="section-container flex h-16 items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Админ-панель KGM Torres</p>
            <p className="text-xs text-muted">Дилеры и регистрации</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary">
            Выйти
          </button>
        </div>
      </header>

      <main className="section-container py-8">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["dealers", "Дилеры"],
              ["registrations", "Регистрации"],
              ["statistics", "Статистика"],
              ["giveaway", "Розыгрыш"],
              ["settings", "Настройки"],
              ["documents", "Документы"],
              ["create", "Создать дилера"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setError("");
                setSuccess("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === id ? "app-tab-active" : "app-tab-inactive"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-6 alert-error">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-6 alert-success">
            {success}
          </p>
        )}

        {createdCredentials && (
          <div className="mt-4 alert-info">
            <p className="font-medium text-brand">Учётные данные дилера</p>
            <p className="mt-2">
              Логин: <code>{createdCredentials.login}</code>
            </p>
            <p>
              PIN: <code>{createdCredentials.pin}</code>
            </p>
            <p className="mt-2 text-xs text-muted">
              Сохраните PIN — он больше не будет показан
            </p>
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-muted">Загрузка...</p>
        ) : tab === "dealers" ? (
          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                Всего дилеров: {dealers.length}
              </p>
              <button
                type="button"
                onClick={handleExportResetPins}
                disabled={exportingPins || !dealers.length}
                className="btn-ghost"
              >
                {exportingPins
                  ? "Генерация и выгрузка..."
                  : "Сбросить PIN и выгрузить Excel"}
              </button>
            </div>
            <div className="overflow-x-auto card-surface">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="app-table-head">
                <tr>
                  <th className="px-4 py-3 font-medium">Название</th>
                  <th className="px-4 py-3 font-medium">Город</th>
                  <th className="px-4 py-3 font-medium">Логин</th>
                  <th className="px-4 py-3 font-medium">Регистрации</th>
                  <th className="px-4 py-3 font-medium">Создан</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {dealers.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="app-table-row"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{dealer.name}</div>
                      {dealer.address && (
                        <div className="mt-1 text-xs text-muted">
                          {dealer.address}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{dealer.city}</td>
                    <td className="px-4 py-3">
                      <code>{dealer.login}</code>
                    </td>
                    <td className="px-4 py-3">{dealer.registrationsCount}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatDate(dealer.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          setResetDealerId(dealer.id);
                          setResetPin("");
                          setResetResult(null);
                          setError("");
                          setSuccess("");
                        }}
                        className="link-brand"
                      >
                        Сменить PIN
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ) : tab === "registrations" ? (
          <div className="mt-8 overflow-x-auto card-surface">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="app-table-head">
                <tr>
                  <th className="px-4 py-3 font-medium">Клиент</th>
                  <th className="px-4 py-3 font-medium">Контакты</th>
                  <th className="px-4 py-3 font-medium">Дилер</th>
                  <th className="px-4 py-3 font-medium">Согласился на рассылку</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3 font-medium">Регистрация</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="app-table-row"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{registration.name}</div>
                      <div className="mt-1 text-xs text-muted">
                        {registration.city}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{registration.phone}</div>
                      <div className="mt-1 text-xs text-muted">
                        {registration.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {registration.dealer.name}, {registration.dealer.city}
                    </td>
                    <td className="px-4 py-3">
                      {registration.consentMarketing ? "Да" : "Нет"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          registration.isActivated
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {registration.isActivated ? "Тест-драйв пройден" : "Ожидает"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatDate(registration.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tab === "statistics" ? (
          <AdminStatistics
            dealers={dealers}
            fieldClassName={fieldClassName}
            onError={setError}
            onSuccess={setSuccess}
          />
        ) : tab === "giveaway" ? (
          <div className="mt-8 space-y-8">
            <div className="card-surface p-8">
              <h2 className="text-lg font-semibold">Розыгрыш Champion</h2>
              <p className="mt-2 text-sm text-muted">
                Случайный выбор 3 победителей среди участников, прошедших
                тест-драйв. После розыгрыша отправьте письма победителям отдельной
                кнопкой.
              </p>
              <p className="mt-4 text-sm">
                Доступно для розыгрыша: <strong>{eligibleCount}</strong>{" "}
                участников
              </p>
              {!giveawayAvailable && giveawayDateLabel && (
                <p className="mt-2 text-sm text-muted">
                  Кнопка станет доступна с даты розыгрыша ({giveawayDateLabel}).
                </p>
              )}
              <button
                type="button"
                onClick={handleRunGiveaway}
                disabled={runningGiveaway || !giveawayAvailable || eligibleCount === 0}
                className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {runningGiveaway ? "Проводим розыгрыш..." : "Провести розыгрыш"}
              </button>
            </div>

            {latestGiveaway && (
              <div className="card-surface overflow-x-auto">
                <h3 className="app-card-header">
                  Результат последнего розыгрыша
                </h3>
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="app-table-head">
                    <tr>
                      <th className="px-4 py-3 font-medium">Место</th>
                      <th className="px-4 py-3 font-medium">Приз</th>
                      <th className="px-4 py-3 font-medium">Победитель</th>
                      <th className="px-4 py-3 font-medium">Контакты</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestGiveaway.winners.map((winner) => {
                      const prize = PRIZES.find((item) => item.place === winner.place);

                      return (
                      <tr
                        key={winner.place}
                        className="app-table-row"
                      >
                        <td className="px-4 py-3">{winner.place}</td>
                        <td className="px-4 py-3 text-muted">
                          {prize ? `${prize.title} ${prize.model}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{winner.name}</div>
                          <div className="mt-1 text-xs text-muted">
                            {winner.city} · {winner.dealer.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">{winner.phone}</td>
                        <td className="px-4 py-3">
                          {winner.email}
                          <div className="mt-1 text-xs text-muted">
                            {winner.emailSent
                              ? "Письмо отправлено"
                              : "Письмо не отправлено"}
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
                {latestGiveaway.winners.some((winner) => !winner.emailSent) && (
                  <div className="border-t border-white/10 px-4 py-4">
                    <button
                      type="button"
                      onClick={handleSendWinnerEmails}
                      disabled={sendingWinnerEmails}
                      className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sendingWinnerEmails
                        ? "Отправляем письма..."
                        : "Отправить сообщения победителям"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {giveawayRuns.length > 0 && (
              <div className="card-surface overflow-x-auto">
                <h3 className="app-card-header">
                  История розыгрышей
                </h3>
                <div className="app-divider">
                  {giveawayRuns.map((run) => (
                    <div key={run.id} className="px-4 py-4">
                      <p className="text-sm text-muted">
                        {formatDate(run.createdAt)}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {run.winners.map((winner) => (
                          <li key={`${run.id}-${winner.place}`}>
                            {winner.place} место — {winner.registration.name} (
                            {winner.registration.phone},{" "}
                            {winner.registration.email})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : tab === "settings" ? (
          <AdminSettings />
        ) : tab === "documents" ? (
          <AdminLegalDocuments />
        ) : (
          <form
            onSubmit={handleCreateDealer}
            className="mt-8 max-w-xl card-surface space-y-4 p-8"
          >
            <h2 className="text-lg font-semibold">Новый дилерский центр</h2>

            <label className="block">
              <span className="mb-2 block text-sm text-muted">
                Название *
              </span>
              <input
                required
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className={fieldClassName}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-muted">Город *</span>
              <input
                required
                value={createForm.city}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, city: e.target.value }))
                }
                className={fieldClassName}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-muted">Адрес</span>
              <input
                value={createForm.address}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className={fieldClassName}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-muted">Email</span>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className={fieldClassName}
                placeholder="dealer@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-muted">
                Логин (если пусто — сгенерируется из названия)
              </span>
              <input
                value={createForm.login}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, login: e.target.value }))
                }
                className={fieldClassName}
                placeholder="moscow-center"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-muted">
                PIN, 4 цифры (если пусто — сгенерируется)
              </span>
              <input
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                value={createForm.pin}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                className={fieldClassName}
                placeholder="1234"
              />
            </label>

            <button
              type="submit"
              disabled={creating}
              className="btn-primary w-full disabled:opacity-60"
            >
              {creating ? "Создание..." : "Создать дилера"}
            </button>
          </form>
        )}
      </main>

      {resetDealerId && resetDealer && (
        <div className="app-modal-overlay">
          <div className="w-full max-w-md card-surface p-8">
            <h2 className="text-lg font-semibold">Сменить PIN</h2>
            <p className="mt-2 text-sm text-muted">
              {resetDealer.name} — логин <code>{resetDealer.login}</code>
            </p>

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-muted">
                  Новый PIN (оставьте пустым для автогенерации)
                </span>
                <input
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  value={resetPin}
                  onChange={(e) =>
                    setResetPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className={fieldClassName}
                  placeholder="••••"
                />
              </label>

              {resetResult && (
                <div className="alert-info">
                  <p>
                    Логин: <code>{resetResult.login}</code>
                  </p>
                  <p>
                    Новый PIN: <code>{resetResult.pin}</code>
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setResetDealerId(null);
                    setResetResult(null);
                    setResetPin("");
                  }}
                  className="btn-secondary flex-1"
                >
                  Закрыть
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {resetting ? "Сохранение..." : "Сменить PIN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
