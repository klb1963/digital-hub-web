// src/app/api/ai-labs/reports/route.ts

// GET /api/ai-labs/reports
// Унифицированный список всех отчётов AI-Labs текущего пользователя (кросс-сервисы).
// Сейчас агрегирует только Channel Analyzer results из Payload.
// Возвращает “report cards” (subject/openUrl/shareToken/metrics) для страницы /ai-labs/reports.

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPayloadServiceToken } from "@/lib/ai-labs/getPayloadServiceToken";

const PAYLOAD_API_URL = (process.env.PAYLOAD_API_URL || "http://localhost:3000").replace(/\/$/, "");

function asRecord(x: unknown): Record<string, unknown> {
  return typeof x === "object" && x !== null ? (x as Record<string, unknown>) : {};
}

function safeInt(x: unknown): number | null {
  if (typeof x === "number" && Number.isFinite(x)) return Math.trunc(x);
  if (typeof x === "string" && x.trim()) {
    const n = Number(x);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  }
  return null;
}

// ------------------------------------------------------------
// GET /api/ai-labs/reports?limit=20&page=1
// List ALL saved AI-Labs reports for current user (across services).
// Currently aggregates Channel Analyzer results.
// ------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(50, safeInt(url.searchParams.get("limit")) ?? 20));
    const page = Math.max(1, safeInt(url.searchParams.get("page")) ?? 1);

    const token = await getPayloadServiceToken();

    const qs = new URLSearchParams({
      "where[userId][equals]": userId,
      sort: "-analyzedAt",
      limit: String(limit),
      page: String(page),
      depth: "0",
    });

    const res = await fetch(
      `${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results?${qs.toString()}`,
      {
        headers: { Authorization: `JWT ${token}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "PAYLOAD_LIST_FAILED", details: text },
        { status: 500 }
      );
    }

    const json = await res.json();
    const docs = Array.isArray(json?.docs) ? (json.docs as unknown[]) : [];

    const items = docs
      .map((d) => {
        const r = asRecord(d);

        const id = String(r["id"] ?? "");
        const channel = String(r["channel"] ?? "");
        const analyzerVersion = String(r["analyzerVersion"] ?? "");

        const returnTo = encodeURIComponent("/ai-labs/reports");
        const subject = channel || "—";

        const openUrl =
          channel && analyzerVersion
            ? `/ai-labs/channel/${encodeURIComponent(channel)}?v=${encodeURIComponent(analyzerVersion)}&returnTo=${returnTo}`
            : channel
            ? `/ai-labs/channel/${encodeURIComponent(channel)}?returnTo=${returnTo}`
            : null;

        const analyzedAt = (r["analyzedAt"] as string | null) ?? null;
        const createdAt = (r["createdAt"] as string | null) ?? null;

        const meta = asRecord(r["meta"]);
        const shareToken =
          typeof meta["shareToken"] === "string" ? (meta["shareToken"] as string) : null;

        return {
          id: id || null,
          service: "channel-analyzer",
          subject,
          channel: channel || null,
          analyzerVersion: analyzerVersion || null,
          reportLanguage: r["reportLanguage"] ?? null,
          depth: r["depth"] ?? null,
          analyzedAt,
          createdAt,
          metrics: r["metrics"] ?? null,
          meta: r["meta"] ?? null,
          shareToken,
          openUrl,
        };
      })
      .filter((x) => Boolean(x.id));

    return NextResponse.json({
      ok: true,
      page: json?.page ?? page,
      totalPages: json?.totalPages ?? 1,
      totalDocs: json?.totalDocs ?? items.length,
      items,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}