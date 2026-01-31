// src/app/api/ai-labs/channel-results/[id]/share/route.ts

// POST /api/ai-labs/channel-results/[id]/share
// Генерирует (или возвращает существующий) shareToken для отчёта.
// Используется для расшаривания полного отчёта по публичной ссылке.
// Требует Clerk auth и проверку ownership; токен хранится в doc.meta.

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

import { getPayloadServiceToken } from "@/lib/ai-labs/getPayloadServiceToken";

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || "http://localhost:3000";

function asRecord(x: unknown): Record<string, unknown> {
  return typeof x === "object" && x !== null ? (x as Record<string, unknown>) : {};
}

function asString(x: unknown): string {
  return typeof x === "string" ? x : "";
}

function makeShareToken(): string {
  // короткий, URL-safe
  return randomUUID().replace(/-/g, "").slice(0, 24);
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const token = await getPayloadServiceToken();

    // 1) read doc
    const readRes = await fetch(`${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results/${encodeURIComponent(id)}`, {
      headers: { Authorization: `JWT ${token}` },
      cache: "no-store",
    });

    if (readRes.status === 404) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    if (!readRes.ok) {
      const text = await readRes.text();
      return NextResponse.json({ error: "PAYLOAD_READ_FAILED", details: text }, { status: 500 });
    }

    const readJson = await readRes.json();
    const doc = readJson?.doc ?? readJson;

    // 🔒 ownership check
    if (String(doc?.userId ?? "") !== String(userId)) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }  

    const meta = asRecord(doc?.meta);
    const existing = asString(meta.shareToken);
    if (existing) {
      return NextResponse.json({ ok: true, shareToken: existing });
    }

    // 2) patch meta.shareToken (merge meta safely)
    const shareToken = makeShareToken();
    const nextMeta = { ...meta, shareToken };

    const patchRes = await fetch(`${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `JWT ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ meta: nextMeta }),
      cache: "no-store",
    });

    if (!patchRes.ok) {
      const text = await patchRes.text();
      return NextResponse.json({ error: "PAYLOAD_PATCH_FAILED", details: text }, { status: 500 });
    }

    return NextResponse.json({ ok: true, shareToken });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}