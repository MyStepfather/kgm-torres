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
    <div className="app-shell">
      <header className="app-header">
        <div className="section-container flex h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="brand-logo">KGM</div>
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
                <span className="step-badge">
                  1
                </span>
                <span>
                  Отсканируйте QR-код клиента <strong className="text-brand">камерой телефона</strong>{" "}
                  (не через браузер — встроенным сканером камеры)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="step-badge">
                  2
                </span>
                <span>Откройте появившуюся ссылку — вы попадёте на страницу участника</span>
              </li>
              <li className="flex gap-3">
                <span className="step-badge">
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
              className="app-field"
              placeholder="https://.../dealer/scan/..."
            />
            {error && (
              <p className="alert-error">{error}</p>
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
