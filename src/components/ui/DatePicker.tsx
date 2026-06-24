"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  formatTestDriveDate,
  formatTestDriveDateRange,
  getCalendarDays,
  parseIsoDate,
  startOfDay,
  toIsoDate,
} from "@/lib/dates";
import {
  getSelectableBounds,
  isDateSelectable,
  type TestDriveSchedule,
} from "@/lib/test-drive-schedule";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DEFAULT_FILTER_MIN = "2020-01-01";

type DatePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  schedule?: TestDriveSchedule;
  min?: string;
  max?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showRangeFooter?: boolean;
};

type PanelPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

const PANEL_GAP = 8;
const VIEWPORT_PADDING = 12;
const ESTIMATED_PANEL_HEIGHT = 360;

function isDateInBounds(isoDate: string, min: string, max: string) {
  const date = parseIsoDate(isoDate.slice(0, 10));
  const minDate = parseIsoDate(min);
  const maxDate = parseIsoDate(max);

  if (!date || !minDate || !maxDate) {
    return false;
  }

  return date >= minDate && date <= maxDate;
}

export function DatePicker({
  id,
  value,
  onChange,
  schedule,
  min,
  max,
  placeholder,
  required,
  className,
  showRangeFooter,
}: DatePickerProps) {
  const bounds = useMemo(() => {
    if (schedule) {
      return getSelectableBounds(schedule);
    }

    return {
      min: min ?? DEFAULT_FILTER_MIN,
      max: max ?? toIsoDate(startOfDay(new Date())),
    };
  }, [schedule, min, max]);

  const minDate = useMemo(() => parseIsoDate(bounds.min)!, [bounds.min]);
  const maxDate = useMemo(() => parseIsoDate(bounds.max)!, [bounds.max]);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const selected = value ? parseIsoDate(value) : null;
    return selected ?? minDate;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectedDate = value ? parseIsoDate(value) : null;
  const days = useMemo(() => getCalendarDays(viewMonth), [viewMonth]);

  const monthLabel = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  const defaultPlaceholder = schedule
    ? "Выберите дату тест-драйва"
    : "Выберите дату";

  const shouldShowRangeFooter = showRangeFooter ?? Boolean(schedule);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPanelPosition(null);
      return;
    }

    let frame = 0;

    function updatePosition() {
      if (!buttonRef.current) {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 288);
      const maxHeight = window.innerHeight - VIEWPORT_PADDING * 2;
      const measuredHeight =
        panelRef.current?.getBoundingClientRect().height ?? ESTIMATED_PANEL_HEIGHT;
      const panelHeight = Math.min(measuredHeight, maxHeight);
      const spaceBelow =
        window.innerHeight - rect.bottom - PANEL_GAP - VIEWPORT_PADDING;
      const spaceAbove = rect.top - PANEL_GAP - VIEWPORT_PADDING;

      let top =
        spaceBelow >= panelHeight || spaceBelow >= spaceAbove
          ? rect.bottom + PANEL_GAP
          : rect.top - panelHeight - PANEL_GAP;

      top = Math.max(
        VIEWPORT_PADDING,
        Math.min(top, window.innerHeight - panelHeight - VIEWPORT_PADDING),
      );

      let left = rect.left;
      if (left + width > window.innerWidth - VIEWPORT_PADDING) {
        left = window.innerWidth - width - VIEWPORT_PADDING;
      }
      left = Math.max(VIEWPORT_PADDING, left);

      setPanelPosition({ top, left, width, maxHeight });
    }

    updatePosition();
    frame = window.requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, viewMonth, shouldShowRangeFooter]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        containerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!value) {
      return;
    }

    const isValid = schedule
      ? isDateSelectable(value, schedule)
      : isDateInBounds(value, bounds.min, bounds.max);

    if (!isValid) {
      onChange("");
    }
  }, [value, schedule, bounds.min, bounds.max, onChange]);

  function isDisabled(date: Date) {
    const iso = toIsoDate(date);

    if (schedule) {
      return !isDateSelectable(iso, schedule);
    }

    return !isDateInBounds(iso, bounds.min, bounds.max);
  }

  function selectDate(date: Date) {
    if (isDisabled(date)) {
      return;
    }

    onChange(toIsoDate(date));
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    setViewMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
  }

  const canGoPrev =
    new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1) >
    new Date(minDate.getFullYear(), minDate.getMonth(), 1);

  const canGoNext =
    new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1) <
    new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const hasAvailableDates = useMemo(() => {
    if (!schedule) {
      return minDate <= maxDate;
    }

    const cursor = new Date(minDate);
    while (cursor <= maxDate) {
      if (isDateSelectable(toIsoDate(cursor), schedule)) {
        return true;
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return false;
  }, [minDate, maxDate, schedule]);

  const panel =
    mounted && open && hasAvailableDates && panelPosition ? (
      <div
        ref={panelRef}
        role="dialog"
        style={{
          position: "fixed",
          top: panelPosition.top,
          left: panelPosition.left,
          width: panelPosition.width,
          maxHeight: panelPosition.maxHeight,
          zIndex: 200,
          overflow: "auto",
        }}
        className="rounded-2xl border border-white/10 bg-card p-4 shadow-2xl shadow-black/40"
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => shiftMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition hover:border-accent hover:text-accent disabled:opacity-30"
            aria-label="Предыдущий месяц"
          >
            ‹
          </button>
          <p className="text-sm font-semibold capitalize">{monthLabel}</p>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => shiftMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition hover:border-accent hover:text-accent disabled:opacity-30"
            aria-label="Следующий месяц"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} />;
            }

            const iso = toIsoDate(day);
            const selected = value === iso;
            const disabled = isDisabled(day);
            const isToday = toIsoDate(day) === toIsoDate(new Date());
            const isExcluded = schedule?.excludedDates.includes(iso) ?? false;

            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => selectDate(day)}
                title={isExcluded ? "Дата недоступна" : undefined}
                className={`flex h-10 items-center justify-center rounded-xl text-sm transition ${
                  selected
                    ? "bg-accent font-semibold text-slate-900"
                    : disabled
                      ? "cursor-not-allowed text-white/20"
                      : isToday
                        ? "border border-accent/40 text-accent hover:bg-white/5"
                        : "text-foreground hover:bg-white/10"
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        {shouldShowRangeFooter && (
          <p className="mt-4 text-center text-xs text-muted">
            {formatTestDriveDateRange(bounds.min, bounds.max)}
          </p>
        )}
      </div>
    ) : null;

  return (
    <div ref={containerRef} className={className ?? ""}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={!hasAvailableDates}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-xl border border-white/10 bg-background px-4 py-3 text-left outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-60 ${
          open ? "border-accent" : ""
        }`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={selectedDate ? "text-foreground" : "text-muted"}>
          {!hasAvailableDates
            ? "Нет доступных дат"
            : selectedDate
              ? formatTestDriveDate(selectedDate)
              : (placeholder ?? defaultPlaceholder)}
        </span>
        <svg
          className="h-5 w-5 shrink-0 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {required && (
        <input
          tabIndex={-1}
          className="pointer-events-none absolute opacity-0"
          value={value}
          onChange={() => undefined}
          required
        />
      )}

      {panel && createPortal(panel, document.body)}
    </div>
  );
}
