"use client";

import { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  ADMIN_DATE_PICKER_MAX,
  ADMIN_DATE_PICKER_MIN,
  formatTestDriveDate,
} from "@/lib/dates";
import type { GiveawayDateSetting } from "@/lib/giveaway-settings";
import {
  isDateInRange,
  type TestDriveSchedule,
} from "@/lib/test-drive-schedule";

export function AdminSettings() {
  const [schedule, setSchedule] = useState<TestDriveSchedule | null>(null);
  const [giveawayDate, setGiveawayDate] = useState<GiveawayDateSetting | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings/test-drive-schedule").then((res) => res.json()),
      fetch("/api/admin/settings/giveaway-date").then((res) => res.json()),
    ])
      .then(([scheduleData, giveawayData]) => {
        setSchedule(scheduleData);
        setGiveawayDate(giveawayData);
      })
      .catch(() => setError("Не удалось загрузить настройки"))
      .finally(() => setLoading(false));
  }, []);

  function addExclusion() {
    if (!schedule || !newExclusion) return;

    const iso = newExclusion.slice(0, 10);
    if (!isDateInRange(iso, schedule)) {
      setError("Дата исключения должна быть в выбранном периоде");
      setSuccess("");
      return;
    }

    if (schedule.excludedDates.includes(iso)) {
      setError("Эта дата уже в списке исключений");
      setSuccess("");
      return;
    }

    setSchedule({
      ...schedule,
      excludedDates: [...schedule.excludedDates, iso].sort(),
    });
    setNewExclusion("");
    setError("");
  }

  function removeExclusion(iso: string) {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      excludedDates: schedule.excludedDates.filter((date) => date !== iso),
    });
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!schedule || !giveawayDate) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const [scheduleResponse, giveawayResponse] = await Promise.all([
        fetch("/api/admin/settings/test-drive-schedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedule),
        }),
        fetch("/api/admin/settings/giveaway-date", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(giveawayDate),
        }),
      ]);

      const scheduleData = await scheduleResponse.json();
      const giveawayData = await giveawayResponse.json();

      if (!scheduleResponse.ok) {
        throw new Error(scheduleData.error ?? "Не удалось сохранить период тест-драйва");
      }

      if (!giveawayResponse.ok) {
        throw new Error(giveawayData.error ?? "Не удалось сохранить дату розыгрыша");
      }

      setSchedule(scheduleData);
      setGiveawayDate(giveawayData);
      setSuccess("Настройки сохранены");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Не удалось сохранить",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="mt-8 text-muted">Загрузка настроек...</p>;
  }

  if (!schedule || !giveawayDate) {
    return (
      <p className="mt-8 text-muted">Не удалось загрузить настройки</p>
    );
  }

  return (
    <form onSubmit={handleSave} className="mt-8 max-w-2xl space-y-6">
      {error && <p className="alert-error">{error}</p>}

      {success && <p className="alert-success">{success}</p>}

      <div className="card-surface p-8">
        <h2 className="text-lg font-semibold">Дата розыгрыша</h2>
        <p className="mt-2 text-sm text-muted">
          В этот день в админке станет доступна кнопка «Провести розыгрыш».
          Дата также отображается на лендинге.
        </p>

        <div className="mt-6 max-w-xs">
          <label
            htmlFor="giveaway-date"
            className="mb-2 block text-sm text-muted"
          >
            Дата розыгрыша *
          </label>
          <DatePicker
            id="giveaway-date"
            required
            value={giveawayDate.date}
            onChange={(date) =>
              setGiveawayDate((prev) => (prev ? { ...prev, date } : prev))
            }
            min={ADMIN_DATE_PICKER_MIN}
            max={ADMIN_DATE_PICKER_MAX}
            placeholder="Выберите дату"
            showRangeFooter={false}
          />
          {giveawayDate.date && (
            <p className="mt-2 text-sm text-muted">
              На сайте: {formatTestDriveDate(giveawayDate.date)}
            </p>
          )}
        </div>
      </div>

      <div className="card-surface p-8">
        <h2 className="text-lg font-semibold">Период тест-драйва</h2>
        <p className="mt-2 text-sm text-muted">
          Клиенты смогут выбирать дату записи только в этом диапазоне. Даты
          раньше сегодняшнего дня недоступны автоматически.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="schedule-date-from"
              className="mb-2 block text-sm text-muted"
            >
              С *
            </label>
            <DatePicker
              id="schedule-date-from"
              required
              value={schedule.dateFrom}
              onChange={(dateFrom) =>
                setSchedule((prev) => (prev ? { ...prev, dateFrom } : prev))
              }
              min={ADMIN_DATE_PICKER_MIN}
              max={schedule.dateTo}
              placeholder="Дата начала"
              showRangeFooter={false}
            />
          </div>

          <div>
            <label
              htmlFor="schedule-date-to"
              className="mb-2 block text-sm text-muted"
            >
              По *
            </label>
            <DatePicker
              id="schedule-date-to"
              required
              value={schedule.dateTo}
              onChange={(dateTo) =>
                setSchedule((prev) => (prev ? { ...prev, dateTo } : prev))
              }
              min={schedule.dateFrom}
              max={ADMIN_DATE_PICKER_MAX}
              placeholder="Дата окончания"
              showRangeFooter={false}
            />
          </div>
        </div>
      </div>

      <div className="card-surface p-8">
        <h2 className="text-lg font-semibold">Исключения</h2>
        <p className="mt-2 text-sm text-muted">
          Дни внутри периода, когда тест-драйв не проводится. Например: с
          13.07 по 31.07, кроме 23.07.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="schedule-exclusion"
              className="mb-2 block text-sm text-muted"
            >
              Дата исключения
            </label>
            <DatePicker
              id="schedule-exclusion"
              value={newExclusion}
              onChange={setNewExclusion}
              min={schedule.dateFrom}
              max={schedule.dateTo}
              placeholder="Выберите дату"
              showRangeFooter={false}
            />
          </div>
          <button
            type="button"
            onClick={addExclusion}
            className="btn-secondary shrink-0"
          >
            Добавить исключение
          </button>
        </div>

        {schedule.excludedDates.length > 0 ? (
          <ul className="mt-6 space-y-2">
            {schedule.excludedDates.map((iso) => (
              <li
                key={iso}
                className="app-panel flex items-center justify-between text-sm"
              >
                <span>{formatTestDriveDate(iso)}</span>
                <button
                  type="button"
                  onClick={() => removeExclusion(iso)}
                  className="text-red-700 hover:underline"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-muted">Исключений пока нет</p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-primary disabled:opacity-60"
      >
        {saving ? "Сохранение..." : "Сохранить настройки"}
      </button>
    </form>
  );
}
