// src/app/ai-labs/reports/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type ReportItem = {
  id: string;
  service?: string | null;
  subject?: string | null;
  channel?: string | null;
  analyzerVersion?: string | null;
  reportLanguage?: string | null;
  depth?: number | null;
  analyzedAt?: string | null;
  createdAt?: string | null;
  metrics?: {
    avgViews?: number | null;
    medianViews?: number | null;
    minViews?: number | null;
    maxViews?: number | null;
  } | null;
  meta?: {
    shareToken?: string | null;
  } | null;
  shareToken?: string | null;
  openUrl?: string | null;
};

type ApiResponse = {
  ok?: boolean;
  page?: number;
  totalPages?: number;
  totalDocs?: number;
  items?: unknown;
};

function fmtInt(x: unknown) {
  if (typeof x !== "number" || !Number.isFinite(x)) return "—";
  return Math.round(x).toLocaleString("ru-RU");
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" });
}

function asRecord(x: unknown): Record<string, unknown> {
  return typeof x === "object" && x !== null ? (x as Record<string, unknown>) : {};
}

export default function AiLabsReportsPage() {
  const { isLoaded, isSignedIn } = useUser();

  const [rows, setRows] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("limit", "50");
    p.set("page", "1");
    return p.toString();
  }, []);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/ai-labs/reports?${qs}`, { cache: "no-store" });
      const json: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const maybeErr =
          typeof (json as Record<string, unknown> | null)?.["error"] === "string"
            ? (json as Record<string, unknown>)["error"]
            : null;
        setErr((maybeErr as string | null) || `HTTP ${res.status}`);
        setRows([]);
        return;
      }

      const r = (json ?? {}) as ApiResponse;
      const list = Array.isArray(r.items) ? (r.items as unknown[]) : [];

      const mapped: ReportItem[] = list
        .map((x) => {
          const a = asRecord(x);
          const meta = asRecord(a["meta"]);
          const metrics = asRecord(a["metrics"]);
          return {
            id: String(a["id"] ?? ""),
            service: typeof a["service"] === "string" ? (a["service"] as string) : null,
            subject: typeof a["subject"] === "string" ? (a["subject"] as string) : null,
            channel: typeof a["channel"] === "string" ? (a["channel"] as string) : null,
            analyzerVersion: typeof a["analyzerVersion"] === "string" ? (a["analyzerVersion"] as string) : null,
            reportLanguage: typeof a["reportLanguage"] === "string" ? (a["reportLanguage"] as string) : null,
            depth: typeof a["depth"] === "number" ? (a["depth"] as number) : null,
            analyzedAt: typeof a["analyzedAt"] === "string" ? (a["analyzedAt"] as string) : null,
            createdAt: typeof a["createdAt"] === "string" ? (a["createdAt"] as string) : null,
            metrics: {
              avgViews: typeof metrics["avgViews"] === "number" ? (metrics["avgViews"] as number) : null,
              medianViews: typeof metrics["medianViews"] === "number" ? (metrics["medianViews"] as number) : null,
              minViews: typeof metrics["minViews"] === "number" ? (metrics["minViews"] as number) : null,
              maxViews: typeof metrics["maxViews"] === "number" ? (metrics["maxViews"] as number) : null,
            },
            meta: {
              shareToken: typeof meta["shareToken"] === "string" ? (meta["shareToken"] as string) : null,
            },
            shareToken: typeof a["shareToken"] === "string" ? (a["shareToken"] as string) : null,
            openUrl: typeof a["openUrl"] === "string" ? (a["openUrl"] as string) : null,
          };
        })
        .filter((x) => Boolean(x.id));

      setRows(mapped);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // ждём, пока Clerk догрузится, иначе на первом заходе возможен race (INTERNAL_ERROR/401)
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      setErr(null);
      setRows([]);
      return;
    }
    void load();
  }, [qs, isLoaded, isSignedIn]);

  async function doDelete(id: string) {
    if (!isSignedIn) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/ai-labs/channel-results/by-id/${encodeURIComponent(id)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const json: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const maybeErr =
          typeof (json as Record<string, unknown> | null)?.["error"] === "string"
            ? (json as Record<string, unknown>)["error"]
            : null;
        toast.error(`Delete failed: ${maybeErr ?? `HTTP ${res.status}`}`);
        return;
      }
      setRows((xs) => xs.filter((r) => r.id !== id));
      toast.success("Отчёт удалён ✅");
    } finally {
      setBusyId(null);
    }
  }

  async function doShare(id: string, openUrl?: string | null) {
    if (!isSignedIn) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/ai-labs/channel-results/by-id/${encodeURIComponent(id)}/share`, {
        method: "POST",
        cache: "no-store",
      });
      const json: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const maybeErr =
          typeof (json as Record<string, unknown> | null)?.["error"] === "string"
            ? (json as Record<string, unknown>)["error"]
            : null;
        toast.error(`Share failed: ${maybeErr ?? `HTTP ${res.status}`}`);
        return;
      }

      const rec = (json ?? {}) as Record<string, unknown>;
      const shareToken = typeof rec["shareToken"] === "string" ? (rec["shareToken"] as string) : null;

      const shareUrl =
        typeof rec["shareUrl"] === "string"
          ? (rec["shareUrl"] as string)
          : shareToken && openUrl
          ? `${window.location.origin}${openUrl}${openUrl.includes("?") ? "&" : "?"}share=${encodeURIComponent(
              shareToken
            )}`
          : null;

      if (!shareUrl) {
        toast.error("Не удалось собрать ссылку для шаринга 😅");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Ссылка скопирована ✅");
      void load();
    } finally {
      setBusyId(null);
    }
  }

  async function doCopyOpen(openUrl?: string | null) {
    if (!openUrl) return;
    const url = `${window.location.origin}${openUrl}`;
    await navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована ✅");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">Мои отчёты</h1>
          <p className="mt-2 text-sm text-black/70">Здесь хранится история сохранённых результатов AI-Labs.</p>
        </div>
        <button
          onClick={() => void load()}
          className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-black/5"
        >
          Обновить
        </button>
      </div>

      {!isSignedIn && (
        <div className="mt-6 rounded-xl border border-black/10 bg-black/5 p-4 text-sm text-black/70">
          История отчётов доступна после входа.
          <span className="ml-2">
            <Link className="underline" href="/sign-in?redirect_url=%2Fai-labs%2Freports">
              Войти
            </Link>
          </span>
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-sm text-neutral-500">Загружаю…</div>
      ) : err ? (
        <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
          Ошибка: {err}
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-6 text-sm text-neutral-500">Пока нет сохранённых отчётов.</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-500">
                <th className="border-b border-neutral-200 pb-2">Дата</th>
                <th className="border-b border-neutral-200 pb-2">Сервис</th>
                <th className="border-b border-neutral-200 pb-2">Объект</th>
                <th className="border-b border-neutral-200 pb-2">Язык</th>
                <th className="border-b border-neutral-200 pb-2">Depth</th>
                <th className="border-b border-neutral-200 pb-2">Views avg/median</th>
                <th className="border-b border-neutral-200 pb-2">Share</th>
                <th className="border-b border-neutral-200 pb-2 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const when = r.analyzedAt ?? r.createdAt ?? null;
                const shareToken = r.shareToken ?? r.meta?.shareToken ?? null;

                return (
                  <tr key={r.id} className="hover:bg-neutral-50">
                    <td className="border-b border-neutral-100 py-3">{fmtDate(when)}</td>
                    <td className="border-b border-neutral-100 py-3">{r.service ?? "—"}</td>
                    <td className="border-b border-neutral-100 py-3">{r.subject ?? r.channel ?? "—"}</td>
                    <td className="border-b border-neutral-100 py-3">{r.reportLanguage ?? "—"}</td>
                    <td className="border-b border-neutral-100 py-3">{r.depth ?? "—"}</td>
                    <td className="border-b border-neutral-100 py-3">
                      {fmtInt(r.metrics?.avgViews)} / {fmtInt(r.metrics?.medianViews)}
                    </td>
                    <td className="border-b border-neutral-100 py-3">
                      {shareToken ? (
                        <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-900">есть</span>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="border-b border-neutral-100 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {r.openUrl ? (
                          <Link
                            href={r.openUrl}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 hover:bg-neutral-50"
                          >
                            Открыть
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-400 opacity-60"
                          >
                            Открыть
                          </button>
                        )}

                        <button
                          disabled={!r.openUrl}
                          onClick={() => void doCopyOpen(r.openUrl)}
                          className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                        >
                          Скопировать
                        </button>

                        <button
                          disabled={!isSignedIn || busyId === r.id}
                          onClick={() => void doShare(r.id, r.openUrl)}
                          className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                        >
                          Зашарить
                        </button>

                        <button
                          disabled={!isSignedIn || busyId === r.id}
                          onClick={() => void doDelete(r.id)}
                          className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}