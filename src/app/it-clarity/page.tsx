// src/app/it-clarity/page.tsx

import Link from "next/link";
import { RichTextRenderer } from '@/components/RichText';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import ItClarityEmailCapture from '@/components/ItClarityEmailCapture';

type Level = "GREEN" | "YELLOW" | "RED";

function normalizeFrom(input?: string) {
  if (!input) return undefined;
  if (input === 'quiz') return 'test';
  return input;
}

function normalizeLevel(input: unknown): Level | null {
  if (typeof input !== "string") return null;
  const v = input.trim().toUpperCase();
  if (v === "GREEN" || v === "YELLOW" || v === "RED") return v;
  return null;
}

function isSerializedEditorState(v: unknown): v is SerializedEditorState {
  return (
    typeof v === 'object' &&
    v !== null &&
    'root' in (v as Record<string, unknown>)
  );
}

type PayloadItClarityResponse = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  levels?: Array<{
    level?: Level | string | null;
    badge?: string | null;
    title?: string | null;
    subtitle?: string | null;
    body?: unknown; // lexical json
    ctaPrimaryLabel?: string | null;
    ctaPrimaryHref?: string | null;
    ctaSecondaryLabel?: string | null;
    ctaSecondaryHref?: string | null;
  }> | null;
};

function getPayloadBaseURL() {
  return (
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://api.leonidk.de'
      : 'http://localhost:3000')
  );
}

async function fetchItClarity(): Promise<PayloadItClarityResponse | null> {
  const base = getPayloadBaseURL();
  const url = `${base.replace(/\/$/, "")}/api/globals/it-clarity?depth=2`;

    try {
        const res = await fetch(url, {
            // ISR: страница будет пересобираться раз в 60 секунд
            next: { revalidate: 60 },
        });

    if (!res.ok) return null;
    const json = (await res.json()) as PayloadItClarityResponse;
    return json;
  } catch {
    return null;
  }
}

export default async function ItClarityPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const level = normalizeLevel(sp.level);
  const from =
    typeof sp.from === "string" ? normalizeFrom(sp.from) : undefined;

  const cms = await fetchItClarity();

  const heroTitle =
    cms?.heroTitle?.trim() || "IT Clarity — разбор результата";
  const heroSubtitle =
    cms?.heroSubtitle?.trim() ||
    "Короткий разбор и следующие шаги — в зависимости от вашего результата.";

  const levelItem = level
    ? cms?.levels?.find((x) => normalizeLevel(x.level) === level) ?? null
    : null;

  const content = levelItem
    ? {
        badge: levelItem.badge || `Уровень: ${level}`,
        title: levelItem.title || heroTitle,
        subtitle: levelItem.subtitle || heroSubtitle,
        body: levelItem.body,
        ctaPrimaryLabel: levelItem.ctaPrimaryLabel || "Связаться",
        ctaPrimaryHref:
          levelItem.ctaPrimaryHref || `/contact?from=it-clarity&level=${level}`,
        ctaSecondaryLabel: levelItem.ctaSecondaryLabel || "Назад",
        ctaSecondaryHref: levelItem.ctaSecondaryHref || "/it-worries-test",
      }
    : null;

    return (
        <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
            <div className="space-y-8">
                <section className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs">
                        <span className="font-medium">IT Clarity</span>
                        <span className="opacity-70">{from ? `from: ${from}` : "страница"}</span>
                    </div>

                    <h1 className="text-3xl font-semibold leading-tight">
                        {content ? content.title : heroTitle}
                    </h1>

                    <p className="text-base opacity-80">
                        {content ? content.subtitle : heroSubtitle}
                    </p>

                    {!content && (
                        <p className="text-sm opacity-70">
                            Укажи параметр{" "}
                            <code className="rounded bg-black/5 px-1 py-0.5">level</code>:{" "}
                            <code className="rounded bg-black/5 px-1 py-0.5">GREEN</code>,{" "}
                            <code className="rounded bg-black/5 px-1 py-0.5">YELLOW</code> или{" "}
                            <code className="rounded bg-black/5 px-1 py-0.5">RED</code>.
                        </p>
                    )}
                </section>

                {content && (
                    <section className="space-y-4">
                        <div className="rounded-2xl border border-black/10 p-6">
                            <div className="text-xs opacity-60">{content.badge}</div>

                            {content.body ? (
                                <div className="prose prose-sm mt-4 max-w-none">
                                    <RichTextRenderer
                                        content={isSerializedEditorState(content.body) ? content.body : null}
                                    />
                                </div>
                            ) : null}

                            <ItClarityEmailCapture level="GREEN" persona="captain" />

                            <div className="mt-6 flex flex-wrap items-center gap-2">
                                <Link
                                    href={content.ctaPrimaryHref}
                                    className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                                >
                                    {content.ctaPrimaryLabel}
                                </Link>

                                <Link
                                    href={content.ctaSecondaryHref}
                                    className="rounded-xl border border-black/10 px-4 py-2 text-sm opacity-80 hover:opacity-100"
                                >
                                    {content.ctaSecondaryLabel}
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}