"use client";

import { useEffect, useState } from "react";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdownParts(targetIso: string): CountdownParts {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeCell({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex w-[57px] flex-col items-center rounded-[8px] bg-[#181728] px-2.5 py-2 sm:w-[68px] sm:rounded-[12px] sm:px-3 sm:py-3 md:w-[103px] md:rounded-[15px] md:px-5 md:py-3.5">
      <span className="text-[33px] font-semibold leading-none text-white sm:text-[40px] md:text-[60px]">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0 text-[7px] font-medium uppercase tracking-[0.08em] text-white/70 sm:mt-1 sm:text-[9px] md:text-[10.5px]">
        {label}
      </span>
    </div>
  );
}

function TimerColon() {
  return (
    <span
      aria-hidden
      className="pb-4 text-xl font-semibold leading-none text-white sm:pb-5 sm:text-2xl md:pb-6 md:text-[34px]"
    >
      :
    </span>
  );
}

type CountdownTimerProps = {
  targetIso: string;
};

export function CountdownTimer({ targetIso }: CountdownTimerProps) {
  const [parts, setParts] = useState<CountdownParts>(() =>
    getCountdownParts(targetIso),
  );

  useEffect(() => {
    setParts(getCountdownParts(targetIso));

    const interval = window.setInterval(() => {
      setParts(getCountdownParts(targetIso));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetIso]);

  const units = [
    { value: parts.days, label: "Дней" },
    { value: parts.hours, label: "часов" },
    { value: parts.minutes, label: "минут" },
    { value: parts.seconds, label: "секунд" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-8">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3 md:gap-8">
          <TimeCell value={unit.value} label={unit.label} />
          {index < units.length - 1 ? <TimerColon /> : null}
        </div>
      ))}
    </div>
  );
}
