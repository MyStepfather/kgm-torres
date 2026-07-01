"use client";

import { useCallback, useEffect, useState } from "react";
import { LegalDocumentMarkdown } from "@/components/landing/LegalDocumentMarkdown";
import {
  LEGAL_DOCUMENT_LABELS,
  LEGAL_DOCUMENT_SLUGS,
  type LegalDocumentRecord,
  type LegalDocumentSlug,
} from "@/lib/legal-document-types";

const MARKDOWN_HINT = `Поддерживается Markdown: ## заголовки, **жирный**, *курсив*, списки, [ссылки](https://example.com), переносы строк.`;

export function AdminLegalDocuments() {
  const [activeSlug, setActiveSlug] = useState<LegalDocumentSlug>("privacy");
  const [document, setDocument] = useState<LegalDocumentRecord | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDocument = useCallback(async (slug: LegalDocumentSlug) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/legal-documents/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось загрузить документ");
      }

      setDocument(data);
      setPageTitle(data.pageTitle);
      setMarkdown(data.markdown);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Не удалось загрузить документ",
      );
      setDocument(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDocument(activeSlug);
  }, [activeSlug, loadDocument]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/legal-documents/${activeSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageTitle, markdown }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось сохранить документ");
      }

      setDocument(data);
      setPageTitle(data.pageTitle);
      setMarkdown(data.markdown);
      setSuccess("Документ сохранён");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Не удалось сохранить документ",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        "Сбросить документ к исходному тексту из кода? Изменения в базе будут удалены.",
      )
    ) {
      return;
    }

    setResetting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/legal-documents/${activeSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось сбросить документ");
      }

      setDocument(data);
      setPageTitle(data.pageTitle);
      setMarkdown(data.markdown);
      setSuccess("Документ сброшен к исходному тексту");
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Не удалось сбросить документ",
      );
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {LEGAL_DOCUMENT_SLUGS.map((slug) => (
          <button
            key={slug}
            type="button"
            onClick={() => setActiveSlug(slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeSlug === slug ? "app-tab-active" : "app-tab-inactive"
            }`}
          >
            {LEGAL_DOCUMENT_LABELS[slug]}
          </button>
        ))}
      </div>

      {error && <p className="alert-error">{error}</p>}
      {success && <p className="alert-success">{success}</p>}

      {loading ? (
        <p className="text-muted">Загрузка документа...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="card-surface p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {LEGAL_DOCUMENT_LABELS[activeSlug]}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Страница:{" "}
                  <code className="text-xs">/{activeSlug}</code>
                  {document?.updatedAt && (
                    <>
                      {" "}
                      · обновлено{" "}
                      {new Intl.DateTimeFormat("ru-RU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(document.updatedAt))}
                    </>
                  )}
                  {document?.isDefault && " · используется текст по умолчанию"}
                </p>
              </div>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm text-muted">
                Заголовок на странице *
              </span>
              <input
                required
                value={pageTitle}
                onChange={(event) => setPageTitle(event.target.value)}
                className="app-field"
              />
            </label>

            <p className="mt-6 text-sm text-muted">{MARKDOWN_HINT}</p>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-muted">Текст (Markdown) *</span>
                <textarea
                  required
                  value={markdown}
                  onChange={(event) => setMarkdown(event.target.value)}
                  className="app-field min-h-[520px] resize-y font-mono text-sm leading-relaxed"
                  spellCheck={false}
                />
              </label>

              <div>
                <p className="mb-2 text-sm text-muted">Предпросмотр</p>
                <div className="max-h-[560px] overflow-y-auto rounded-[20px] border border-border bg-white p-6">
                  <p className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#111111]">
                    {pageTitle || "Заголовок"}
                  </p>
                  <div className="mt-10">
                    <LegalDocumentMarkdown markdown={markdown} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || resetting}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={saving || resetting}
              className="btn-secondary disabled:opacity-60"
            >
              {resetting ? "Сброс..." : "Сбросить к умолчанию"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
