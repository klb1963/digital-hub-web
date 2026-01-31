// src/app/ai-labs/channel/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { ChannelAnalyzerReport } from "@/app/ai-labs/ChannelAnalyzerReport";
import { ReportHistoryTable } from "./ReportHistoryTable";

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
    };
    // важно: API отдаёт unified result/meta (то же, что на /ai-labs)
    result?: unknown;
    meta?: unknown;
  }
  | { error: "NOT_FOUND" }
  | { error: string; details?: unknown; message?: unknown };

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" });
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
  searchParams: Promise<{ v?: string; share?: string; returnTo?: string }>;
}) {
  const { userId } = await auth();
  const isAuthed = Boolean(userId);

  const { slug } = await params;
  const sp = await searchParams;

  const analyzerVersion = (sp?.v || "open_v1").toString();
  const share = (sp?.share || "").toString();
  const rawReturnTo = typeof sp?.returnTo === "string" ? sp.returnTo : "";
  const backHref =
    rawReturnTo && rawReturnTo.startsWith("/") ? rawReturnTo : "/ai-labs";

  // Важно: fetch на наш внутренний API-route (он уже делает gating preview/full)
  const qs = new URLSearchParams();
  if (analyzerVersion) qs.set("v", analyzerVersion);
  if (share) qs.set("share", share);

  const baseUrl = await getBaseUrl();
  const apiUrl = `${baseUrl}/api/ai-labs/channel-results/by-channel/${encodeURIComponent(slug)}?${qs.toString()}`;

  // IMPORTANT: forward cookies so the API route can see Clerk session on server-side fetch
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      cookie,
      // optional but sometimes helpful:
      "user-agent": h.get("user-agent") ?? "",
    },
  }).catch(() => null);

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
          <Link href={backHref} className="text-sm underline">
            ← Вернуться в AI-Labs
          </Link>
        </div>
      </main>
    );
  }

  const { preview, access } = data;

  const redirectBack = encodeURIComponent(
    `/ai-labs/channel/${encodeURIComponent(slug)}?v=${encodeURIComponent(analyzerVersion)}&returnTo=${encodeURIComponent(backHref)}`
  );  
  const signInHref = `/sign-in?redirect_url=${redirectBack}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            @{preview.channel}
          </h1>
          <div className="mt-2 text-sm text-black/70">
            Версия:{" "}
            <span className="font-medium text-black">{preview.analyzerVersion}</span>
            {" · "}Язык:{" "}
            <span className="font-medium text-black">{preview.reportLanguage}</span>
            {" · "}Глубина:{" "}
            <span className="font-medium text-black">{preview.depth}</span>
            {" · "}Время:{" "}
            <span className="font-medium text-black">{fmtDate(preview.analyzedAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={backHref}
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

      <div className="mt-8">
        <ChannelAnalyzerReport
          status="READY"
          result={data.result ?? null} 
          meta={data.meta ?? null}
          variant="full"
        />
      </div>

      <div className="mt-10">
        <ReportHistoryTable
          channel={String(preview.channel ?? slug)}
          analyzerVersion={analyzerVersion}
          isAuthed={isAuthed}
          signInHref={signInHref}
        />
      </div>

    </main>
  );
}