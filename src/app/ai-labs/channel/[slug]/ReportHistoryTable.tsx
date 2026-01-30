// src/app/ai-labs/channel/[slug]/ReportHistoryTable.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Row = {
  id: string;
  channel?: string;
  reportLanguage?: "EN" | "RU" | "DE" | string;
  depth?: number | null;
  analyzerVersion?: string;
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
};

type ApiRow = {
  id?: string;
  _id?: string;
  channel?: string;
  reportLanguage?: string;
  depth?: number | null;
  analyzerVersion?: string;
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

export function ReportHistoryTable(props: {
  channel: string;
  analyzerVersion: string;
  isAuthed: boolean;
  signInHref: string;
}) {
  const { channel, analyzerVersion, isAuthed, signInHref } = props;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("channel", channel);
    p.set("v", analyzerVersion);
    p.set("limit", "50");
    return p.toString();
  }, [channel, analyzerVersion]);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/ai-labs/channel-results?${qs}`, {
        cache: "no-store",
      });

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

      const list: ApiRow[] =
        Array.isArray((json as { items?: unknown })?.items)
          ? (((json as { items: unknown }).items as unknown[]) as ApiRow[])
          : Array.isArray(json)
          ? (json as ApiRow[])
          : [];

      const mapped: Row[] = list
        .map((x) => ({
          id: String(x.id ?? x._id ?? ""),
          channel: x.channel,
          reportLanguage: x.reportLanguage,
          depth: x.depth ?? null,
          analyzerVersion: x.analyzerVersion,
          analyzedAt: x.analyzedAt ?? null,
          createdAt: x.createdAt ?? null,
          metrics: x.metrics ?? null,
          meta: x.meta ?? null,
        }))
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
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  async function doDelete(id: string) {
    if (!isAuthed) return;
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

        toast.error(`Удаление не удалось: ${maybeErr ?? `HTTP ${res.status}`}`);
        return;
      }

      setRows((xs) => xs.filter((r) => r.id !== id));
      toast.success("Отчёт удалён");
    } finally {
      setBusyId(null);
    }
  }

  async function doShare(id: string) {
    if (!isAuthed) return;
    setBusyId(id);

    try {
        const tId = toast.loading("Готовлю ссылку…");
      const res = await fetch(
        `/api/ai-labs/channel-results/by-id/${encodeURIComponent(id)}/share`,
        {
          method: "POST",
          cache: "no-store",
        }
      );

      const json: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const maybeErr =
          typeof (json as Record<string, unknown> | null)?.["error"] === "string"
            ? (json as Record<string, unknown>)["error"]
            : null;

        toast.dismiss(tId);
        toast.error(`Шаринг не удался: ${maybeErr ?? `HTTP ${res.status}`}`);
        return;
      }

      const rec = (json ?? {}) as Record<string, unknown>;

      const shareUrl =
        typeof rec["shareUrl"] === "string"
          ? (rec["shareUrl"] as string)
          : typeof rec["shareToken"] === "string"
          ? `${window.location.origin}/ai-labs/channel/${encodeURIComponent(
              channel
            )}?v=${encodeURIComponent(analyzerVersion)}&share=${encodeURIComponent(
              rec["shareToken"] as string
            )}`
          : null;

      if (shareUrl) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.dismiss(tId);
          toast.success("Ссылка скопирована ✅");
        } catch {
          toast.dismiss(tId);
          toast.error("Не удалось скопировать в буфер (clipboard недоступен)");
        }
      } else {
        toast.dismiss(tId);
        toast.error("Не удалось получить shareUrl/shareToken 😅");
      }

      void load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-neutral-900">Сохранённые отчёты</h2>
        <button
          onClick={() => void load()}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 hover:bg-neutral-50"
        >
          Обновить
        </button>
      </div>

      {!isAuthed && (
        <div className="mt-3 rounded-xl border border-black/10 bg-black/5 p-4 text-sm text-black/70">
          История отчётов доступна после входа.{" "}
          <a className="underline" href={signInHref}>
            Войти
          </a>
        </div>
      )}

      {loading ? (
        <div className="mt-4 text-sm text-neutral-500">Загружаю…</div>
      ) : err ? (
        <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
          Ошибка: {err}
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-4 text-sm text-neutral-500">Пока нет сохранённых отчётов.</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-500">
                <th className="border-b border-neutral-200 pb-2">Дата</th>
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
                const shareToken = r.meta?.shareToken ?? null;

                return (
                  <tr key={r.id} className="hover:bg-neutral-50">
                    <td className="border-b border-neutral-100 py-3">{fmtDate(when)}</td>
                    <td className="border-b border-neutral-100 py-3">{r.reportLanguage ?? "—"}</td>
                    <td className="border-b border-neutral-100 py-3">{r.depth ?? "—"}</td>
                    <td className="border-b border-neutral-100 py-3">
                      {fmtInt(r.metrics?.avgViews)} / {fmtInt(r.metrics?.medianViews)}
                    </td>
                    <td className="border-b border-neutral-100 py-3">
                      {shareToken ? (
                        <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
                          есть
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="border-b border-neutral-100 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={!isAuthed || busyId === r.id}
                          onClick={() => void doShare(r.id)}
                          className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                        >
                          Зашарить
                        </button>
                        <button
                          disabled={!isAuthed || busyId === r.id}
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

      <div className="mt-3 text-xs text-neutral-500">
        Идея: отчёты автосохраняются, а тут — история + удаление + шаринг.
      </div>
    </section>
  );
}