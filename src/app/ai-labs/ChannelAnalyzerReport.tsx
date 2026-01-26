// src/app/ai-labs/ChannelAnalyzerReport.tsx

"use client";

type InsightPreview = {
  title: string
  summary: string
  why?: string | null
}

type CharacteristicPost = {
  bucket: "top" | "typical" | "low" | "thematic"
  tgMessageId: string
  url: string
  date?: string | null
  views?: number | null
  snippet?: string | null
}

type AnalyzerResultOpenV1 = {
  profile?: AnalyzerProfile
  stats?: OpenV1Stats
  sampling?: OpenV1Sampling
  insightsPreview?: InsightPreview[]
  characteristicPosts?: CharacteristicPost[]
  _result?: { id: string | number; channel: string; analyzerVersion?: string; analyzedAt?: string }
}


const CONTENT_TYPE_ORDER = [
    "educational",
    "motivational",
    "marketing",
    "news",
    "personal_opinion",
] as const;

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

type OpenV1Stats = {
    views?: { avg?: number; median?: number; min?: number; max?: number };
    reactions?: { avg?: number; median?: number };
    replies?: { avg?: number; median?: number };
    posting_regularity?: { posts_per_week_est?: number };
    availability?: { subscribers?: boolean; views?: boolean; reactions?: boolean; replies?: boolean };
    subscribers?: number | null;
    views_to_subscribers_ratio?: number | null;
    sample?: { messages_for_stats?: number };
};

type OpenV1Sampling = {
    requestedDepth?: number;
    messagesFetchedFromTelegram?: number;
    messagesSkippedEmpty?: number;
    messagesInsertedNew?: number;
    messagesUsedForStats?: number;
    messagesUsedForLlm?: number;
    selectionPolicy?: { top?: number; typical?: number; weak?: number; metric?: string };
};

function isRecord(x: unknown): x is Record<string, unknown> {
    return typeof x === "object" && x !== null;
}

function safeNum(x: unknown): number | null {
    return typeof x === "number" && Number.isFinite(x) ? x : null;
}

function fmtInt(x: unknown): string {
    const n = safeNum(x);
    if (n == null) return "—";
    return Math.round(n).toLocaleString("ru-RU");
}

function pct(x: unknown): string {
    if (typeof x !== "number" || !Number.isFinite(x)) return "—";
    return `${Math.round(x * 100)}%`;
}

function fmtDate(x: unknown): string {
  if (typeof x !== "string" || !x) return "—"
  const d = new Date(x)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" })
}

function bucketLabel(b: CharacteristicPost["bucket"]) {
  if (b === "top") return "TOP"
  if (b === "typical") return "TYPICAL"
  if (b === "low") return "LOW"
  return b.toUpperCase()
}

export function ChannelAnalyzerReport(props: { status: string; result: unknown; meta: unknown }) {
    const { status, result, meta } = props;
    if (status !== "READY") return null;

    // open_v1 result shape: { stats, sampling, profile, examples }
    const r = (result ?? null) as AnalyzerResultOpenV1;

    const profile: AnalyzerProfile =
        isRecord(r) && isRecord(r.profile) ? (r.profile as AnalyzerProfile) : (isRecord(r) ? (r as AnalyzerProfile) : {});

    const stats: OpenV1Stats | null =
        isRecord(r) && isRecord(r.stats) ? (r.stats as OpenV1Stats) : null;

    const sampling: OpenV1Sampling | null =
        isRecord(r) && isRecord(r.sampling) ? (r.sampling as OpenV1Sampling) : null;

    const insightsPreview: InsightPreview[] = Array.isArray(r?.insightsPreview) ? r.insightsPreview : []

    const characteristicPosts: CharacteristicPost[] = Array.isArray(r?.characteristicPosts) ? r.characteristicPosts : []

    const summaryText = (profile.overall_summary ?? "").trim();

    const shortLine = (
        <div className="text-sm text-neutral-600">
            Запрошено: <span className="font-medium text-neutral-900">{fmtInt(sampling?.requestedDepth)}</span>
            {" · "}В TG просмотрено: <span className="font-medium text-neutral-900">{fmtInt(sampling?.messagesFetchedFromTelegram)}</span>
            {" · "}Текстовых в БД: <span className="font-medium text-neutral-900">{fmtInt(stats?.sample?.messages_for_stats ?? sampling?.messagesUsedForStats)}</span>
            {" · "}Для AI-профиля: <span className="font-medium text-neutral-900">{fmtInt(sampling?.messagesUsedForLlm)}</span>
        </div>
    );

    return (
        <div className="mt-8 grid gap-4 min-w-0">
            {/* SUMMARY */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Профиль канала + статистика (open_v1)
                    </h2>
                    {shortLine}
                </div>

                <p className="mt-4 whitespace-pre-line text-base leading-7 text-neutral-900">
                    {summaryText || "Недостаточно данных для summary."}
                </p>
            </div>

            {/* INSIGHTS PREVIEW */}
            {insightsPreview.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900">Инсайты (preview)</h3>
                <div className="mt-4 grid gap-3">
                  {insightsPreview.map((x, i) => (
                    <div key={`${x.title}-${i}`} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="text-sm font-semibold text-neutral-900">{x.title}</div>
                      <div className="mt-2 text-sm text-neutral-800 whitespace-pre-line">{x.summary}</div>
                      {x.why ? (
                        <div className="mt-2 text-xs text-neutral-600 whitespace-pre-line">{x.why}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHARACTERISTIC POSTS */}
            {characteristicPosts.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900">Характерные посты</h3>
                <div className="mt-4 grid gap-3">
                  {characteristicPosts.map((p, i) => (
                    <a
                      key={`${p.tgMessageId}-${i}`}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-neutral-200 bg-white p-4 hover:bg-neutral-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
                            {bucketLabel(p.bucket)}
                          </span>
                          <span className="text-xs text-neutral-600">id {p.tgMessageId}</span>
                        </div>
                        <div className="text-xs text-neutral-600">
                          {fmtDate(p.date)} · {p.views != null ? `${fmtInt(p.views)} views` : "views —"}
                        </div>
                      </div>
                      {p.snippet ? (
                        <div className="mt-3 text-sm text-neutral-900 whitespace-pre-line">{p.snippet}</div>
                      ) : (
                        <div className="mt-3 text-sm text-neutral-500">—</div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}  

            {/* STATS */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900">Статистика (по доступным метрикам Telegram)</h3>

                <div className="mt-4 grid gap-4">
                    <div className="grid gap-2 text-sm text-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-700">Средние просмотры</span>
                            <span className="font-medium">{fmtInt(stats?.views?.avg)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-700">Медиана просмотров</span>
                            <span className="font-medium">{fmtInt(stats?.views?.median)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-700">Мин/макс просмотров</span>
                            <span className="font-medium">
                                {fmtInt(stats?.views?.min)} / {fmtInt(stats?.views?.max)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-neutral-700">Средние реакции</span>
                            <span className="font-medium">{fmtInt(stats?.reactions?.avg)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-700">Средние комментарии</span>
                            <span className="font-medium">{fmtInt(stats?.replies?.avg)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-neutral-700">Постов в неделю (оценка)</span>
                            <span className="font-medium">{stats?.posting_regularity?.posts_per_week_est ?? "—"}</span>
                        </div>

                        <div className="pt-2 text-xs text-neutral-500">
                            Подписчики / охваты: {stats?.availability?.subscribers ? "доступно" : "недоступно через обычный API"}.
                        </div>
                    </div>

                    {/* How counted */}
                    {sampling && (
                        <details className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <summary className="cursor-pointer text-sm font-medium text-neutral-900">
                                Как считали
                            </summary>

                            <div className="mt-3 text-sm text-neutral-800 grid gap-2">
                                <div>
                                    Из Telegram просмотрено: <span className="font-medium">{fmtInt(sampling.messagesFetchedFromTelegram)}</span>,
                                    пустых/без текста отсеяно: <span className="font-medium">{fmtInt(sampling.messagesSkippedEmpty)}</span>,
                                    новых добавлено: <span className="font-medium">{fmtInt(sampling.messagesInsertedNew)}</span>.
                                </div>
                                <div>
                                    Для статистики использовано: <span className="font-medium">{fmtInt(sampling.messagesUsedForStats)}</span>.
                                </div>
                                <div>
                                    Для AI-профиля взято: <span className="font-medium">{fmtInt(sampling.messagesUsedForLlm)}</span>{" "}
                                    (top {sampling.selectionPolicy?.top ?? "—"} + typical {sampling.selectionPolicy?.typical ?? "—"} + weak {sampling.selectionPolicy?.weak ?? "—"},
                                    метрика: {sampling.selectionPolicy?.metric ?? "—"}).
                                </div>
                            </div>
                        </details>
                    )}
                </div>
            </div>

            {/* PROFILE FIELDS */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900">Профиль канала (структурно)</h3>

                <div className="mt-4 grid gap-5 min-w-0">
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">author_role</div>
                        <div className="mt-1 text-sm text-neutral-900">{profile.author_role ?? "—"}</div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">main_topics</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(profile.main_topics ?? []).map((t, i) => (
                                <span key={`${t}-${i}`} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900">
                                    {t}
                                </span>
                            ))}
                            {(!profile.main_topics || profile.main_topics.length === 0) && (
                                <span className="text-sm text-neutral-500">—</span>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">what_is_missing</div>
                        <div className="mt-1 text-xs text-neutral-500 max-w-prose">
                            Гипотезы LLM-модели о том, каких типов контента мало в текущей выборке.
                            Это не факт и не сравнение с другими каналами.
                        </div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-900">
                            {(profile.what_is_missing ?? []).map((t, i) => (
                                <li key={`${t}-${i}`}>{t}</li>
                            ))}
                            {(!profile.what_is_missing || profile.what_is_missing.length === 0) && (
                                <li className="text-neutral-500">—</li>
                            )}
                        </ul>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">audience_profile</div>
                        <div className="mt-1 text-sm text-neutral-900">{profile.audience_profile ?? "—"}</div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">secondary_topics</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(profile.secondary_topics ?? []).map((t, i) => (
                                <span key={`${t}-${i}`} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900">
                                    {t}
                                </span>
                            ))}
                            {(!profile.secondary_topics || profile.secondary_topics.length === 0) && (
                                <span className="text-sm text-neutral-500">—</span>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">dominant_narratives</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-900">
                            {(profile.dominant_narratives ?? []).map((t, i) => (
                                <li key={`${t}-${i}`}>{t}</li>
                            ))}
                            {(!profile.dominant_narratives || profile.dominant_narratives.length === 0) && (
                                <li className="text-neutral-500">—</li>
                            )}
                        </ul>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">content_type_distribution</div>
                        <div className="mt-2 grid gap-2 text-sm text-neutral-900">
                            {profile.content_type_distribution ? (
                                CONTENT_TYPE_ORDER.map((k) => (
                                    <div key={k} className="flex items-center justify-between gap-3">
                                        <span className="text-neutral-700">{k}</span>
                                        <span className="font-medium">{pct(profile.content_type_distribution?.[k])}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-neutral-500">—</div>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-medium text-neutral-500">implicit_problems_discussed</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-900">
                            {(profile.implicit_problems_discussed ?? []).map((t, i) => (
                                <li key={`${t}-${i}`}>{t}</li>
                            ))}
                            {(!profile.implicit_problems_discussed || profile.implicit_problems_discussed.length === 0) && (
                                <li className="text-neutral-500">—</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* DEBUG JSON */}
            <details className="rounded-2xl border border-neutral-200 bg-white p-5 min-w-0">
                <summary className="cursor-pointer text-sm font-medium text-neutral-900">
                    Показать полный JSON <span className="text-neutral-500">(для тех, кому нужно)</span>
                </summary>

                <pre className="mt-4 max-h-[420px] max-w-full overflow-auto rounded-xl bg-neutral-50 p-4 text-xs text-neutral-900 whitespace-pre-wrap break-words min-w-0">
                    {JSON.stringify(result, null, 2)}
                </pre>

                {meta != null && (
                    <>
                        <div className="mt-6 text-sm font-medium text-neutral-900">Meta</div>
                        <pre className="mt-3 max-h-[420px] max-w-full overflow-auto rounded-xl bg-neutral-50 p-4 text-xs text-neutral-900 whitespace-pre-wrap break-words min-w-0">
                            {JSON.stringify(meta, null, 2)}
                        </pre>
                    </>
                )}
            </details>
        </div>
    );
}