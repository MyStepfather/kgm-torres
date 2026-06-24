"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { extractTokenFromQr } from "@/lib/qrcode";

export default function DealerPage() {
  const router = useRouter();
  const [manualToken, setManualToken] = useState("");
  const [error, setError] = useState("");

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const token = extractTokenFromQr(manualToken);
    if (!token) {
      setError("Введите ссылку или код из QR");
      return;
    }

    router.push(`/dealer/scan/${token}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-card/60">
        <div className="section-container flex h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-xs font-bold text-accent">
              KGM
            </div>
            <div>
              <p className="text-sm font-semibold">Кабинет дилера</p>
              <p className="text-xs text-muted">Подтверждение тест-драйва</p>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-12">
        <div className="mx-auto max-w-lg space-y-8">
          <div className="card-surface p-8">
            <h1 className="text-2xl font-bold">Как открыть заявку участника</h1>
            <ol className="mt-6 space-y-4 text-sm text-muted">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-slate-900">
                  1
                </span>
                <span>
                  Отсканируйте QR-код клиента <strong className="text-white">камерой телефона</strong>{" "}
                  (не через браузер — встроенным сканером камеры)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-slate-900">
                  2
                </span>
                <span>Откройте появившуюся ссылку — вы попадёте на страницу участника</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-slate-900">
                  3
                </span>
                <span>
                  Войдите с логином и PIN дилерского центра — сразу увидите данные клиента
                </span>
              </li>
            </ol>
          </div>

          <form
            onSubmit={handleManualSubmit}
            className="card-surface space-y-4 p-8"
          >
            <h2 className="text-lg font-semibold">Или введите ссылку вручную</h2>
            <p className="text-sm text-muted">
              Если камера уже открыла ссылку — этот блок не нужен
            </p>
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 outline-none focus:border-accent"
              placeholder="https://.../dealer/scan/..."
            />
            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary w-full">
              Открыть заявку
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
