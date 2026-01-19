"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ReportLanguage = "EN" | "RU" | "DE";
type PollStatus = "IDLE" | "CREATED" | "PROCESSING" | "READY" | "FAILED";

type CreateResponse = { requestId: string };

type CreateErrorResponse = {
  error?: unknown;
  details?: unknown;
  message?: unknown;
};

type CreateApiResponse = CreateResponse | CreateErrorResponse;

type PollReadyResponse = {
  status: "READY";
  result: unknown;
  meta?: unknown;
};

type PollNotReadyResponse = {
  status: string;
  error?: unknown | null;
  message?: unknown;
};

type PollResponse = PollReadyResponse | PollNotReadyResponse;

function isPollReady(r: PollResponse): r is PollReadyResponse {
  return r.status === "READY";
}

function isCreateOk(r: CreateApiResponse): r is CreateResponse {
  return typeof (r as { requestId?: unknown }).requestId === "string";
}

function normalizeChannelInput(input: string) {
  const s = input.trim();
  // разрешаем: @username, username, https://t.me/username
  return s.replace(/^https?:\/\/t\.me\//i, "").replace(/^@/, "");
}

function errToText(x: unknown): string {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (x instanceof Error) return x.message;
  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

const CONTENT_TYPE_ORDER = [
  "educational",
  "motivational",
  "marketing",
  "news",
  "personal_opinion",
] as const;

/** ─────────────────────────────────────────────
 * Result typing (lightweight, not strict)
 * ───────────────────────────────────────────── */
type AnalyzerProfile = {
  author_role?: string;
  main_topics?: string[];
  overall_summary?: string;
  what_is_missing?: string[];
  audience_profile?: string;
  secondary_topics?: string[];
  dominant_narratives?: string[];
  content_type_distribution?: Record<string, number>;
  implicit_problems_discussed?: string[];
  purposeHintUsed?: string;
};

type AnalysisMeta = {
  messagesUsed?: number;
  messagesInDb?: number;
  requestedLimit?: number;
  charsUsed?: number;
  charBudget?: number;
  reportLanguage?: ReportLanguage;
};

type AnalyzerMeta = {
  analysisMeta?: AnalysisMeta;
  reportLanguage?: ReportLanguage;
  depth?: number;
  channel?: string;
  llmModel?: string;
  analyzedAt?: string;
  analyzerVersion?: string;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function hasProfile(x: unknown): x is { profile: unknown } {
  return isRecord(x) && "profile" in x;
}

function toAnalyzerProfile(x: unknown): AnalyzerProfile {
  if (!isRecord(x) || Array.isArray(x)) return {};
  return x as AnalyzerProfile;
}

function safeNum(x: unknown): number | null {
  return typeof x === "number" && Number.isFinite(x) ? x : null;
}

function pct(x: unknown): string {
  if (typeof x !== "number" || !Number.isFinite(x)) return "—";
  return `${Math.round(x * 100)}%`;
}

function isSmallSample(
  messagesUsed: number | null,
  requestedLimit: number | null
): boolean {
  if (!messagesUsed) return false;

  // критически мало — реально риск искажения
  if (messagesUsed < 3) return true;

  // мало относительно ожиданий пользователя
  if (requestedLimit && messagesUsed < requestedLimit * 0.1) return true;

  return false;
}

export default function AiLabsPage() {
  const [channelInput, setChannelInput] = useState("");
  const [reportLanguage, setReportLanguage] = useState<ReportLanguage>("EN");
  const [depth, setDepth] = useState<number>(200);
  const [purposeHint] = useState<string>("ui-first-run");

  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<PollStatus>("IDLE");
  const [result, setResult] = useState<unknown>(null);
  const [meta, setMeta] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pollingTimerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canSubmit = useMemo(() => {
    const s = channelInput.trim();
    return s.length > 0 && depth >= 200 && depth <= 500;
  }, [channelInput, depth]);

  // ✅ Минимальный фикс: пока есть активный request — не создаем новый
  const isBusy = useMemo(() => {
    return status === "CREATED" || status === "PROCESSING";
  }, [status]);

  function stopPolling() {
    if (pollingTimerRef.current) {
      window.clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }

  async function pollOnce(id: string) {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(`/api/ai-labs/channel-analyzer/${id}`, {
        method: "GET",
        cache: "no-store",
        signal: ac.signal,
      });

      const data = (await res.json()) as PollResponse;

      if (!res.ok) {
        setStatus("FAILED");
        const err =
          "error" in data && data.error != null ? data.error : "POLL_FAILED";
        const msg =
          "message" in data && data.message != null ? data.message : "";
        setError(`${errToText(err)}${msg ? `: ${errToText(msg)}` : ""}`.trim());
        stopPolling();
        return;
      }

      if (isPollReady(data)) {
        setStatus("READY");
        setResult(data.result ?? null);
        setMeta(data.meta ?? null);
        setError(null);
        stopPolling();
        return;
      }

      setStatus("PROCESSING");
    } catch (e: unknown) {
      // ✅ Abort — это штатно (мы сами abort'им предыдущий fetch при новом тике)
      if (typeof e === "object" && e !== null && "name" in e) {
        const name = (e as { name?: unknown }).name;
        if (name === "AbortError") return;
      }

      setStatus("FAILED");
      setError(e instanceof Error ? e.message : "Polling error");
      stopPolling();
    }
  }

  function startPolling(id: string) {
    stopPolling();
    setStatus("PROCESSING");

    // pollOnce теперь сам ловит ошибки (и игнорит AbortError)
    void pollOnce(id);

    pollingTimerRef.current = window.setInterval(() => {
      void pollOnce(id);
    }, 1500);
  }

  async function onSubmit() {
    if (!canSubmit || isSubmitting) return;

    // ✅ Минимальный фикс: если уже есть активный request — просто продолжаем polling
    if (requestId && (status === "CREATED" || status === "PROCESSING")) {
      startPolling(requestId);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setMeta(null);

    const payload = {
      channelInput: normalizeChannelInput(channelInput),
      reportLanguage,
      depth,
      purposeHint: purposeHint.trim() || undefined,
    };

    try {
      const res = await fetch("/api/ai-labs/channel-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as CreateApiResponse;

      if (!res.ok) {
        setStatus("FAILED");
        const err =
          "error" in data && data.error != null ? data.error : "CREATE_FAILED";
        const details =
          "details" in data && data.details != null
            ? data.details
            : "message" in data && data.message != null
              ? data.message
              : "";
        setError(
          `${errToText(err)}${details ? `: ${errToText(details)}` : ""}`.trim()
        );
        return;
      }

      if (!isCreateOk(data)) {
        setStatus("FAILED");
        setError("CREATE_FAILED: invalid response shape");
        return;
      }

      const id = String(data.requestId);
      setRequestId(id);
      setStatus("CREATED");
      startPolling(id);
    } catch (e: unknown) {
      setStatus("FAILED");
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    return () => stopPolling();
  }, []);

  /** ─────────────────────────────────────────────
   * Prepare render data (safe)
   * ───────────────────────────────────────────── */
  const m = (meta ?? null) as AnalyzerMeta | null;

 const profile: AnalyzerProfile =
   hasProfile(result)
     ? toAnalyzerProfile(result.profile)
     : toAnalyzerProfile(result);

  const summaryText = (profile.overall_summary ?? "").trim();

  const analysisMeta = m?.analysisMeta ?? null;
  const messagesUsed = safeNum(analysisMeta?.messagesUsed) ?? null;
  const messagesInDb = safeNum(analysisMeta?.messagesInDb) ?? null;
  const requestedLimit = safeNum(analysisMeta?.requestedLimit) ?? null;

  // ✅ FIX: второй аргумент
  const showSmallSampleWarning =
    status === "READY" && isSmallSample(messagesUsed, requestedLimit);

  // --- Hitnt for disabled reason ---
    const isDisabled = !canSubmit || isSubmitting || isBusy;
    const disabledTitle = !canSubmit
      ? "Введите канал и выберите глубину анализа"
      : undefined;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-white">
        AI-Labs — анализ Telegram-канала
      </h1>

      {/* FORM */}
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 min-w-0">
          <input
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder="https://t.me/username или @username"
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
          />

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">Язык отчёта</span>
            <select
              value={reportLanguage}
              onChange={(e) =>
                setReportLanguage(e.target.value as ReportLanguage)
              }
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
            >
              <option value="EN">English</option>
              <option value="RU">Русский</option>
              <option value="DE">Deutsch</option>
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Глубина анализа <span className="text-neutral-500">(200–500)</span>
            </span>
            <input
              type="number"
              min={200}
              max={500}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
            />
          </label>

          {/* purposeHint оставляем скрытым, но на будущее */}
          <input type="hidden" value={purposeHint} readOnly />

          <div title={disabledTitle} className="w-full">
            <button
              disabled={isDisabled}
              onClick={onSubmit}
              className="
                w-full rounded-xl px-4 py-2 text-sm font-medium transition
                bg-emerald-600 text-white hover:bg-emerald-700
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                disabled:bg-emerald-100 disabled:text-emerald-800
                disabled:cursor-not-allowed disabled:opacity-100
              "
            >
              {isSubmitting ? "Анализирую…" : "Получить профиль"}
            </button>
          </div>

          <div className="text-sm text-neutral-400">
            Статус: {status} {requestId && `(requestId=${requestId})`}
          </div>

          {error && (
            <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* RESULT */}
      {status === "READY" && (
        <div className="mt-8 grid gap-4 min-w-0">
          {/* SUMMARY */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-neutral-900">
                Профиль актуального контента канала
              </h2>

              <div className="text-sm text-neutral-600">
                Фактически проанализировано текстовых сообщений:
                <span className="font-medium text-neutral-900">
                  {" "}
                  {messagesUsed ?? "—"}
                </span>
                <span className="text-neutral-500">
                  {" "}
                  (в базе: {messagesInDb ?? "—"}, запрошено:{" "}
                  {requestedLimit ?? "—"})
                </span>
              </div>
            </div>

            {showSmallSampleWarning && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <div className="font-medium">⚠️ Адаптивная выборка</div>
                <div className="mt-1 text-amber-800">
                  Анализ выполняется в пределах фиксированного объёма текста и
                  основан на содержании и объеме сообщений, а не на их количестве.
                  В этом случае несколько крупных по объему текста публикаций
                  полностью выбрали допустимый объём и определили профиль канала.
                </div>
              </div>
            )}

            <p className="mt-4 whitespace-pre-line text-base leading-7 text-neutral-900">
              {summaryText || "Недостаточно данных для summary."}
            </p>
          </div>

          {/* PROFILE FIELDS (in JSON order) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900">
              Профиль канала (структурно)
            </h3>

            <div className="mt-4 grid gap-5 min-w-0">
              {/* author_role */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  author_role
                </div>
                <div className="mt-1 text-sm text-neutral-900">
                  {profile.author_role ?? "—"}
                </div>
              </div>

              {/* main_topics */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  main_topics
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(profile.main_topics ?? []).map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900"
                    >
                      {t}
                    </span>
                  ))}
                  {(!profile.main_topics || profile.main_topics.length === 0) && (
                    <span className="text-sm text-neutral-500">—</span>
                  )}
                </div>
              </div>

              {/* what_is_missing */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  what_is_missing
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-900">
                  {(profile.what_is_missing ?? []).map((t, i) => (
                    <li key={`${t}-${i}`}>{t}</li>
                  ))}
                  {(!profile.what_is_missing ||
                    profile.what_is_missing.length === 0) && (
                    <li className="text-neutral-500">—</li>
                  )}
                </ul>
              </div>

              {/* audience_profile */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  audience_profile
                </div>
                <div className="mt-1 text-sm text-neutral-900">
                  {profile.audience_profile ?? "—"}
                </div>
              </div>

              {/* secondary_topics */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  secondary_topics
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(profile.secondary_topics ?? []).map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900"
                    >
                      {t}
                    </span>
                  ))}
                  {(!profile.secondary_topics ||
                    profile.secondary_topics.length === 0) && (
                    <span className="text-sm text-neutral-500">—</span>
                  )}
                </div>
              </div>

              {/* dominant_narratives */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  dominant_narratives
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-900">
                  {(profile.dominant_narratives ?? []).map((t, i) => (
                    <li key={`${t}-${i}`}>{t}</li>
                  ))}
                  {(!profile.dominant_narratives ||
                    profile.dominant_narratives.length === 0) && (
                    <li className="text-neutral-500">—</li>
                  )}
                </ul>
              </div>

              {/* content_type_distribution */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  content_type_distribution
                </div>
                <div className="mt-2 grid gap-2 text-sm text-neutral-900">
                  {profile.content_type_distribution ? (
                    CONTENT_TYPE_ORDER.map((k) => {
                      const v = profile.content_type_distribution?.[k];
                      return (
                        <div
                          key={k}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-neutral-700">{k}</span>
                          <span className="font-medium">{pct(v)}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-neutral-500">—</div>
                  )}
                </div>
              </div>

              {/* implicit_problems_discussed */}
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-500">
                  implicit_problems_discussed
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-900">
                  {(profile.implicit_problems_discussed ?? []).map((t, i) => (
                    <li key={`${t}-${i}`}>{t}</li>
                  ))}
                  {(!profile.implicit_problems_discussed ||
                    profile.implicit_problems_discussed.length === 0) && (
                    <li className="text-neutral-500">—</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* FULL JSON (optional) */}
          <details className="rounded-2xl border border-neutral-200 bg-white p-5 min-w-0">
            <summary className="cursor-pointer text-sm font-medium text-neutral-900">
              Показать полный JSON{" "}
              <span className="text-neutral-500">(для тех, кому нужно)</span>
            </summary>

            <pre className="mt-4 max-h-[420px] max-w-full overflow-auto rounded-xl bg-neutral-50 p-4 text-xs text-neutral-900 whitespace-pre-wrap break-words min-w-0">
              {JSON.stringify(profile, null, 2)}
            </pre>

            {meta != null && (
              <>
                <div className="mt-6 text-sm font-medium text-neutral-900">
                  Meta
                </div>
                <pre className="mt-3 max-h-[420px] max-w-full overflow-auto rounded-xl bg-neutral-50 p-4 text-xs text-neutral-900 whitespace-pre-wrap break-words min-w-0">
                  {JSON.stringify(meta, null, 2)}
                </pre>
              </>
            )}
          </details>
        </div>
      )}
    </main>
  );
}