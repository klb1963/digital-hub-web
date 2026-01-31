// src/app/api/ai-labs/channel-results/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPayloadServiceToken } from "@/lib/ai-labs/getPayloadServiceToken";

const PAYLOAD_API_URL = (process.env.PAYLOAD_API_URL || "http://localhost:3000").replace(/\/$/, "");

function normalizeSlug(input: string) {
  return String(input || "").trim().replace(/^@/, "");
}

function asRecord(x: unknown): Record<string, unknown> {
  return typeof x === "object" && x !== null ? (x as Record<string, unknown>) : {};
}

function safeStr(x: unknown): string | null {
  return typeof x === "string" && x.trim() ? x.trim() : null;
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
// GET /api/ai-labs/channel-results?channel=<slug>&v=open_v1&limit=20&page=1
// List saved results for current user + channel + analyzerVersion
// ------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const url = new URL(req.url);

    const scope = url.searchParams.get("scope"); // "mine" | null
    const channel = normalizeSlug(url.searchParams.get("channel") || "");
    const analyzerVersion = url.searchParams.get("v") || "open_v1";

    const limit = Math.max(1, Math.min(50, safeInt(url.searchParams.get("limit")) ?? 20));
    const page = Math.max(1, safeInt(url.searchParams.get("page")) ?? 1);

    if (scope !== "mine" && !channel) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Query param `channel` is required" },
        { status: 400 }
      );
    }

    // -------------------------------
    // Query builder
    // -------------------------------
    const token = await getPayloadServiceToken();

    const qs = new URLSearchParams({
      "where[userId][equals]": userId,
      sort: "-analyzedAt",
      limit: String(limit),
      page: String(page),
      depth: "0", // no relationship expansion
    });

    if (scope !== "mine") {
      qs.set("where[channel][equals]", channel);
      qs.set("where[analyzerVersion][equals]", analyzerVersion);
    }

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
    const docs = Array.isArray(json?.docs) ? json.docs : [];

    const asRecord = (x: unknown): Record<string, unknown> =>
      typeof x === "object" && x !== null ? (x as Record<string, unknown>) : {};

    const items = (docs as unknown[]).map((d: unknown) => {
      const r = asRecord(d);
      return {
        id: r["id"] ?? null,
        request: r["request"] ?? null,
        channel: r["channel"] ?? null,
        analyzerVersion: r["analyzerVersion"] ?? null,
        reportLanguage: r["reportLanguage"] ?? null,
        service: "channel-analyzer",
        depth: r["depth"] ?? null,
        analyzedAt: r["analyzedAt"] ?? null,
        createdAt: r["createdAt"] ?? null,
        period: r["period"] ?? null,
        metrics: r["metrics"] ?? null,
        meta: r["meta"] ?? null,
      };
    });

    return NextResponse.json({
      ok: true,
      scope: scope ?? "channel",
      channel,
      analyzerVersion,
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

// ------------------------------------------------------------
// POST /api/ai-labs/channel-results
// Create a saved result doc in Payload.
// IMPORTANT: Result.request is required & unique (1:1 with request)
// Body example:
// {
//   "request": "<requestId>",
//   "resultJson": {...},
//   "analyzedAt": "...",            // optional
//   "period": {...},                // optional
//   "metrics": {...},               // optional
//   "insights": [...],              // optional
//   "characteristicPosts": [...],   // optional
//   "meta": {...}                   // optional
// }
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const b = asRecord(body);

    const requestId = safeStr(b["request"]);
    const resultJson = b["resultJson"];

    if (!requestId) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "`request` (id) is required" },
        { status: 400 }
      );
    }
    if (resultJson == null) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "`resultJson` is required" },
        { status: 400 }
      );
    }

    const payloadData: Record<string, unknown> = {
      request: requestId,
      resultJson,
    };

    // Optional fields
    if (safeStr(b["analyzedAt"])) payloadData.analyzedAt = b["analyzedAt"];
    if (b["period"] != null) payloadData.period = b["period"];
    if (b["metrics"] != null) payloadData.metrics = b["metrics"];
    if (b["insights"] != null) payloadData.insights = b["insights"];
    if (b["characteristicPosts"] != null) payloadData.characteristicPosts = b["characteristicPosts"];
    if (b["meta"] != null) payloadData.meta = b["meta"];

    // NOTE:
    // userId/channel/reportLanguage/depth/analyzerVersion are denormalized from Request by Payload hook (beforeValidate)
    // if you don't set them here.

    const token = await getPayloadServiceToken();

    const res = await fetch(`${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results`, {
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payloadData),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "PAYLOAD_CREATE_FAILED", details: text },
        { status: 500 }
      );
    }

    const created = await res.json();
    return NextResponse.json({
      ok: true,
      id: created?.doc?.id ?? created?.id ?? null,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}