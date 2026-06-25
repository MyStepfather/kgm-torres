"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { formatTestDriveDate, startOfDay, toIsoDate } from "@/lib/dates";

type DealerOption = {
  id: string;
  name: string;
  city: string;
};

type StatisticsItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  testDriveDate: string;
  isActivated: boolean;
  activatedAt: string | null;
  createdAt: string;
  dealer: {
    name: string;
    city: string;
  };
};

type StatisticsResponse = {
  summary: {
    totalParticipants: number;
    totalActivated: number;
  };
  items: StatisticsItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  cities: string[];
};

type AdminStatisticsProps = {
  dealers: DealerOption[];
  fieldClassName: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const PAGE_SIZE = 20;
const todayIso = toIsoDate(startOfDay(new Date()));

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildQueryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }

  return search.toString();
}

async function downloadExport(url: string, fallbackFilename: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error ?? "Не удалось выгрузить файл");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filenameMatch = disposition?.match(/filename="([^"]+)"/);
  const filename = filenameMatch?.[1] ?? fallbackFilename;
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export function AdminStatistics({
  dealers,
  fieldClassName,
  onError,
  onSuccess,
}: AdminStatisticsProps) {
  const [draftDealerId, setDraftDealerId] = useState("");
  const [draftCity, setDraftCity] = useState("");
  const [draftDateFrom, setDraftDateFrom] = useState("");
  const [draftDateTo, setDraftDateTo] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [city, setCity] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"all" | "period" | null>(null);
  const [data, setData] = useState<StatisticsResponse | null>(null);

  const loadStatistics = useCallback(async () => {
    setLoading(true);
    onError("");

    try {
      const query = buildQueryString({
        dealerId,
        city,
        dateFrom,
        dateTo,
        page,
        pageSize: PAGE_SIZE,
      });

      const response = await fetch(`/api/admin/statistics?${query}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Не удалось загрузить статистику");
      }

      setData(payload);
    } catch (loadError) {
      onError(
        loadError instanceof Error
          ? loadError.message
          : "Не удалось загрузить статистику",
      );
    } finally {
      setLoading(false);
    }
  }, [city, dateFrom, dateTo, dealerId, onError, page]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  function handleApplyFilters(event: React.FormEvent) {
    event.preventDefault();
    setDealerId(draftDealerId);
    setCity(draftCity);
    setDateFrom(draftDateFrom);
    setDateTo(draftDateTo);
    setPage(1);
  }

  function handleResetFilters() {
    setDraftDealerId("");
    setDraftCity("");
    setDraftDateFrom("");
    setDraftDateTo("");
    setDealerId("");
    setCity("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  async function handleExport(scope: "all" | "period") {
    if (scope === "period" && (!dateFrom || !dateTo)) {
      onError("Укажите период: дату начала и дату окончания");
      return;
    }

    setExporting(scope);
    onError("");
    onSuccess("");

    try {
      const query = buildQueryString({
        scope,
        dealerId,
        city,
        dateFrom: scope === "period" ? dateFrom : undefined,
        dateTo: scope === "period" ? dateTo : undefined,
      });

      await downloadExport(
        `/api/admin/statistics/export?${query}`,
        scope === "all" ? "registrations-all.xlsx" : "registrations-period.xlsx",
      );

      onSuccess(
        scope === "all"
          ? "Регистрации за всё время выгружены в Excel"
          : "Регистрации за период выгружены в Excel",
      );
    } catch (exportError) {
      onError(
        exportError instanceof Error
          ? exportError.message
          : "Не удалось выгрузить регистрации",
      );
    } finally {
      setExporting(null);
    }
  }

  const cities = data?.cities ?? [];

  const dealerOptions = useMemo(
    () =>
      dealers.map((dealer) => ({
        value: dealer.id,
        label: `${dealer.name}, ${dealer.city}`,
        searchText: `${dealer.name} ${dealer.city}`,
      })),
    [dealers],
  );

  const cityOptions = useMemo(
    () =>
      cities.map((item) => ({
        value: item,
        label: item,
      })),
    [cities],
  );

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-surface p-6">
          <p className="text-sm text-muted">Всего участников</p>
          <p className="mt-2 text-3xl font-semibold">
            {loading ? "…" : (data?.summary.totalParticipants ?? 0)}
          </p>
        </div>
        <div className="card-surface p-6">
          <p className="text-sm text-muted">Всего прошедших тест-драйв</p>
          <p className="mt-2 text-3xl font-semibold">
            {loading ? "…" : (data?.summary.totalActivated ?? 0)}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleApplyFilters}
        className="card-surface grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4"
      >
        <SearchableSelect
          id="stats-dealer"
          label="Дилер"
          value={draftDealerId}
          onChange={setDraftDealerId}
          options={dealerOptions}
          fieldClassName={fieldClassName}
          placeholder="Поиск дилера..."
          emptyLabel="Все дилеры"
        />

        <SearchableSelect
          id="stats-city"
          label="Город"
          value={draftCity}
          onChange={setDraftCity}
          options={cityOptions}
          fieldClassName={fieldClassName}
          placeholder="Поиск города..."
          emptyLabel="Все города"
        />

        <div>
          <label htmlFor="stats-date-from" className="mb-2 block text-sm text-muted">
            Дата регистрации с
          </label>
          <DatePicker
            id="stats-date-from"
            value={draftDateFrom}
            onChange={setDraftDateFrom}
            max={todayIso}
            placeholder="Дата начала"
            showRangeFooter={false}
          />
        </div>

        <div>
          <label htmlFor="stats-date-to" className="mb-2 block text-sm text-muted">
            Дата регистрации по
          </label>
          <DatePicker
            id="stats-date-to"
            value={draftDateTo}
            onChange={setDraftDateTo}
            min={draftDateFrom || undefined}
            max={todayIso}
            placeholder="Дата окончания"
            showRangeFooter={false}
          />
        </div>

        <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-4">
          <button type="submit" className="btn-primary">
            Применить фильтры
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-secondary"
          >
            Сбросить
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleExport("all")}
          disabled={exporting !== null}
          className="btn-ghost"
        >
          {exporting === "all" ? "Выгрузка..." : "Выгрузить за всё время"}
        </button>
        <button
          type="button"
          onClick={() => handleExport("period")}
          disabled={exporting !== null}
          className="btn-ghost"
        >
          {exporting === "period" ? "Выгрузка..." : "Выгрузить за период"}
        </button>
      </div>

      <div className="overflow-x-auto card-surface">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="app-table-head">
            <tr>
              <th className="px-4 py-3 font-medium">Клиент</th>
              <th className="px-4 py-3 font-medium">Контакты</th>
              <th className="px-4 py-3 font-medium">Дилер</th>
              <th className="px-4 py-3 font-medium">Тест-драйв</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Регистрация</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Загрузка...
                </td>
              </tr>
            ) : data?.items.length ? (
              data.items.map((registration) => (
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
                    {formatTestDriveDate(registration.testDriveDate)}
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
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Нет регистраций по выбранным фильтрам
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Показано {(data.pagination.page - 1) * data.pagination.pageSize + 1}–
            {Math.min(
              data.pagination.page * data.pagination.pageSize,
              data.pagination.total,
            )}{" "}
            из {data.pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || data.pagination.page <= 1}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Назад
            </button>
            <span className="px-3 text-sm text-muted">
              Страница {data.pagination.page} из {data.pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(data.pagination.totalPages, current + 1),
                )
              }
              disabled={loading || data.pagination.page >= data.pagination.totalPages}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Вперёд
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
