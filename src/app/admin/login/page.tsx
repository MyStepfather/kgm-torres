"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Ошибка входа");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Ошибка входа",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md card-surface p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          KGM Torres
        </p>
        <h1 className="mt-2 text-2xl font-bold">Админ-панель</h1>
        <p className="mt-2 text-sm text-muted">
          Вход для управления дилерами и регистрациями
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Логин</span>
            <input
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 outline-none focus:border-accent"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-muted">Пароль</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 outline-none focus:border-accent"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
