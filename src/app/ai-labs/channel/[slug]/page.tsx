// src/app/ai-labs/channel/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import type { InsightPreview } from "@/lib/ai-labs/types";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

type CharacteristicPost = {
  bucket: "top" | "typical" | "low" | "thematic";
  tgMessageId: string;
  url: string;
  date?: string | null;
  views?: number | null;
  snippet?: string | null;
};

type ChannelResultApiResponse =
  | {
      ok: true;
      access: "preview" | "full";
      preview: {
        channel: string;
        analyzerVersion: string;
        analyzedAt: string;
        reportLanguage: "EN" | "RU" | "DE";
        depth: number;
        period?: { postsCount?: number; dateFrom?: string | null; dateTo?: string | null } | null;
        metrics?: {
          avgViews?: number | null;
          medianViews?: number | null;
          minViews?: number | null;
          maxViews?: number | null;
          avgReactions?: number | null;
          avgComments?: number | null;
        } | null;
        profile?: unknown; // отображаем аккуратно, без строгой схемы
        stats?: unknown;
        characteristicPosts?: CharacteristicPost[];
        insightsPreview?: Pick<InsightPreview, "title" | "summary" | "why">[];
      };
      full?: {
        insights?: InsightPreview[];
      };
    }
  | { error: "NOT_FOUND" }
  | { error: string; details?: unknown; message?: unknown };

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === "string");
}

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

function pickSummary(profile: unknown): string {
  if (!isRecord(profile)) return "—";

  const v =
    profile["overall_summary"] ??
    profile["overallSummary"];

  if (typeof v !== "string") return "—";

  const s = v.trim();
  return s || "—";
}

function extractTopics(profile: unknown): string[] {
  if (!isRecord(profile)) return [];

  const xs =
    profile["main_topics"] ??
    profile["mainTopics"];

  if (!isStringArray(xs)) return [];

  return xs.slice(0, 12);
}

function extractStatsViews(stats: unknown): {
  avg?: number;
  median?: number;
  min?: number;
  max?: number;
} | null {
  if (!isRecord(stats)) return null;

  const views = stats["views"];
  if (!isRecord(views)) return null;

  const pickNum = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? v : undefined;

  return {
    avg: pickNum(views["avg"]),
    median: pickNum(views["median"]),
    min: pickNum(views["min"]),
    max: pickNum(views["max"]),
  };
}

async function getBaseUrl(): Promise<string> {
  const h = await headers();

  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ??
    "localhost:3001";

  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function ChannelResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string; share?: string }>;
}) {
  const { userId } = await auth();
  const isAuthed = Boolean(userId);

  const { slug } = await params;
  const sp = await searchParams;

  const analyzerVersion = (sp?.v || "open_v1").toString();
  const share = (sp?.share || "").toString();

  // Важно: fetch на наш внутренний API-route (он уже делает gating preview/full)
  const qs = new URLSearchParams();
  if (analyzerVersion) qs.set("v", analyzerVersion);
  if (share) qs.set("share", share);

  const baseUrl = await getBaseUrl();
  const apiUrl = `${baseUrl}/api/ai-labs/channel-result/${encodeURIComponent(slug)}?${qs.toString()}`;
  const res = await fetch(apiUrl, { cache: "no-store" }).catch(() => null);

  if (!res) return notFound();

  if (res.status === 404) return notFound();

  const data = (await res.json()) as ChannelResultApiResponse;

  if ("error" in data) {
    if (data.error === "NOT_FOUND") return notFound();
    // не валим страницу — показываем ошибку
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-black">Результат анализа</h1>
        <p className="mt-3 text-sm text-red-700">
          Ошибка: {data.error}
          {"details" in data && data.details ? ` — ${String(data.details)}` : ""}
        </p>
        <div className="mt-6">
          <Link href="/ai-labs" className="text-sm underline">
            ← Вернуться в AI-Labs
          </Link>
        </div>
      </main>
    );
  }

  const { preview, access } = data;
  const profile = preview.profile ?? null;
  const stats = preview.stats ?? null;
  const topics = extractTopics(profile);
  const summary = pickSummary(profile);
  const views = extractStatsViews(stats);

  const redirectBack = encodeURIComponent(`/ai-labs/channel/${encodeURIComponent(slug)}?v=${encodeURIComponent(analyzerVersion)}`);
  const signInHref = `/sign-in?redirect_url=${redirectBack}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            @{preview.channel}
          </h1>
          <div className="mt-2 text-sm text-black/70">
            Версия: <span className="font-medium text-black">{preview.analyzerVersion}</span>
            {" · "}Язык: <span className="font-medium text-black">{preview.reportLanguage}</span>
            {" · "}Глубина: <span className="font-medium text-black">{fmtInt(preview.depth)}</span>
            {" · "}Время: <span className="font-medium text-black">{fmtDate(preview.analyzedAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/ai-labs"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-black/15 bg-white text-black hover:bg-black/5"
          >
            ← Вернуться
          </Link>

          {access === "preview" && !isAuthed ? (
            <Link
              href={signInHref}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-black/15 bg-black text-white hover:bg-black/90"
            >
              Войти для полного результата
            </Link>
          ) : null}
        </div>
      </div>

      {/* banner access */}
      {access === "preview" && (
        <div className="mt-6 rounded-2xl border border-black/10 bg-black/5 p-5">
          <div className="text-sm text-black/80">
            Это <span className="font-semibold">preview</span>. Полные инсайты и доказательства (evidence) доступны
            после входа или по ссылке с параметром <span className="font-mono">?share=...</span>.
          </div>
        </div>
      )}

      {/* summary */}
      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Краткое summary</h2>
        <p className="mt-3 whitespace-pre-line text-base leading-7 text-black">
          {summary}
        </p>

        {topics.length > 0 && (
          <div className="mt-5">
            <div className="text-xs font-medium text-black/60">Основные темы</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {topics.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="rounded-full bg-black/5 px-3 py-1 text-xs text-black"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* metrics */}
      <section className="mt-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-black">Метрики</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-xs text-black/60">Средние просмотры</div>
            <div className="mt-1 text-lg font-semibold text-black">{fmtInt(views?.avg)}</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-xs text-black/60">Медиана просмотров</div>
            <div className="mt-1 text-lg font-semibold text-black">{fmtInt(views?.median)}</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-xs text-black/60">Мин просмотров</div>
            <div className="mt-1 text-lg font-semibold text-black">{fmtInt(views?.min)}</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-xs text-black/60">Макс просмотров</div>
            <div className="mt-1 text-lg font-semibold text-black">{fmtInt(views?.max)}</div>
          </div>
        </div>

        {preview.period && (
          <div className="mt-4 text-sm text-black/70">
            Период:{" "}
            <span className="font-medium text-black">{fmtDate(preview.period.dateFrom)}</span>
            {" — "}
            <span className="font-medium text-black">{fmtDate(preview.period.dateTo)}</span>
            {" · "}постов: <span className="font-medium text-black">{fmtInt(preview.period.postsCount)}</span>
          </div>
        )}
      </section>

      {/* insights preview */}
      <section className="mt-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-black">Инсайты</h2>
          {access === "preview" && (
            <span className="text-xs text-black/60">в preview показываем 1–2</span>
          )}
        </div>

        <div className="mt-4 grid gap-3">
          {(preview.insightsPreview ?? []).length === 0 ? (
            <div className="text-sm text-black/60">Пока нет инсайтов для показа.</div>
          ) : (
            (preview.insightsPreview ?? []).map((x, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-black">{x.title}</div>
                <div className="mt-2 text-sm text-black/80">{x.summary}</div>
                {x.why ? <div className="mt-2 text-xs text-black/60">{x.why}</div> : null}
              </div>
            ))
          )}
        </div>

        {access === "preview" && (
          <div className="mt-4 text-sm text-black/70">
            <Link href={signInHref} className="underline">
              Войти
            </Link>{" "}
            чтобы увидеть полный список инсайтов и evidence.
          </div>
        )}
      </section>

      {/* characteristic posts */}
      <section className="mt-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-black">Characteristic posts</h2>
        <div className="mt-4 grid gap-3">
          {(preview.characteristicPosts ?? []).length === 0 ? (
            <div className="text-sm text-black/60">Посты не найдены.</div>
          ) : (
            (preview.characteristicPosts ?? []).slice(0, 15).map((p, i) => (
              <div key={`${p.tgMessageId}-${i}`} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-black/60">
                    bucket: <span className="font-medium text-black">{p.bucket}</span>
                    {" · "}views: <span className="font-medium text-black">{fmtInt(p.views)}</span>
                    {" · "}date: <span className="font-medium text-black">{fmtDate(p.date ?? null)}</span>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs underline text-black/80"
                  >
                    Открыть в Telegram ↗
                  </a>
                </div>
                {p.snippet ? (
                  <div className="mt-2 text-sm text-black/85 whitespace-pre-line">
                    {p.snippet}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-black/50">—</div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* full section */}
      {access === "full" && data.full?.insights && (
        <section className="mt-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-black">Полные инсайты (full)</h2>
          <div className="mt-4 grid gap-3">
            {(data.full.insights ?? []).map((x, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-black">{x.title}</div>
                <div className="mt-2 text-sm text-black/80">{x.summary}</div>
                {x.why ? <div className="mt-2 text-xs text-black/60">{x.why}</div> : null}

                {Array.isArray(x.evidencePosts) && x.evidencePosts.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-black/60">Evidence</div>
                    <div className="mt-2 grid gap-2">
                      {x.evidencePosts.slice(0, 4).map((e, j) => (
                        <div key={j} className="rounded-lg border border-black/10 bg-black/5 p-3">
                          <div className="text-xs text-black/70">
                            role: <span className="font-medium text-black">{e.role}</span>
                            {" · "}views: <span className="font-medium text-black">{fmtInt(e.views)}</span>
                            {" · "}date: <span className="font-medium text-black">{fmtDate(e.date ?? null)}</span>
                          </div>
                          {e.snippet ? (
                            <div className="mt-1 text-sm text-black/85">{e.snippet}</div>
                          ) : null}
                          <div className="mt-2">
                            <a href={e.url} target="_blank" rel="noreferrer" className="text-xs underline">
                              Открыть пост ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}