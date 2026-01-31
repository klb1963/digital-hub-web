// src/app/api/ai-labs/channel-results/[slug]/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPayloadServiceToken } from "@/lib/ai-labs/getPayloadServiceToken";
import type { InsightPreview } from "@/lib/ai-labs/types";

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || "http://localhost:3000";

function normalizeSlug(input: string) {
  return String(input || "").trim().replace(/^@/, "");
}

function asRecord(x: unknown): Record<string, unknown> {
  return typeof x === "object" && x !== null ? (x as Record<string, unknown>) : {};
}

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await ctx.params;
    const url = new URL(req.url);

    const channel = normalizeSlug(slug);
    const analyzerVersion = url.searchParams.get("v") || "open_v1";
    const share = url.searchParams.get("share") || "";

    // ✅ Clerk auth (reliable in app/api when cookies are forwarded)
    const { userId } = await auth();
    const isAuthed = Boolean(userId);
    const rid = url.searchParams.get("rid") || "";

    const token = await getPayloadServiceToken();

    // If rid is provided — open a specific saved report by id.
    // Otherwise — fallback to the latest report for channel+version.
    const resRes = rid
      ? await fetch(`${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results/${encodeURIComponent(rid)}`, {
          headers: { Authorization: `JWT ${token}` },
          cache: "no-store",
        })
      : await fetch(
          `${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results?${new URLSearchParams({
            "where[channel][equals]": channel,
            "where[analyzerVersion][equals]": analyzerVersion,
            limit: "1",
            sort: "-analyzedAt",
          }).toString()}`,
          {
            headers: { Authorization: `JWT ${token}` },
            cache: "no-store",
          }
        );

    if (!resRes.ok) {
      const text = await resRes.text();
      return NextResponse.json(
        { error: "PAYLOAD_READ_RESULT_FAILED", details: text },
        { status: 500 }
      );
    }

    const json = await resRes.json();
    const doc = rid ? (json?.doc ?? json) : json?.docs?.[0];
    if (!doc) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    // Anonymous report detection (server truth)
    const docUserId = String(doc?.userId ?? "");
    const isAnonymousReport =
      !docUserId || docUserId === "anonym" || docUserId === "anonymous";

    // Safety: if rid points to a different channel — treat as NOT_FOUND
    if (String(doc?.channel ?? "") !== channel) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    // Gate full access:
    // - signed in OR share token matches doc.meta.shareToken (if present)
    const metaShare = String(doc?.meta?.shareToken || "");
    const shareOk = Boolean(share && metaShare && share === metaShare);
    const fullAllowed = isAuthed || shareOk;

    const access: "preview" | "full" = fullAllowed ? "full" : "preview";

    // characteristicPosts: limit only TYPICAL to 5 (product decision)
    const characteristicPostsRaw = (doc.characteristicPosts ?? []) as Array<{
      bucket?: string;
      [k: string]: unknown;
    }>;

    const characteristicPosts = fullAllowed
      ? [
          ...characteristicPostsRaw.filter((p) => p.bucket === "top"),
          ...characteristicPostsRaw
            .filter((p) => p.bucket === "typical")
            .slice(0, 5),
          ...characteristicPostsRaw.filter(
            (p) => p.bucket !== "top" && p.bucket !== "typical"
          ),
        ]
      : [];

    // insights preview: 1–2 only, safe for preview
    const insightsPreview: Pick<InsightPreview, "title" | "summary" | "why">[] =
      (doc.insights as InsightPreview[] | undefined)
        ?.slice(0, 3)
        .map((x) => ({ title: x.title, summary: x.summary, why: x.why ?? null })) ?? [];

    // --- preview header ONLY (teaser page uses this as "шапку") ---
    const preview = {
      channel: doc.channel,
      analyzerVersion: doc.analyzerVersion,
      analyzedAt: doc.analyzedAt,
      reportLanguage: doc.reportLanguage,
      depth: doc.depth,
      period: doc.period ?? null,
      metrics: doc.metrics ?? null,
    };

    // --- unified result/meta (same shape as on /ai-labs) ---
    // В preview-режиме отдаём только безопасные части.
    // В full-режиме — всё, включая инсайты и characteristic posts.
    const result = {
      profile: doc.resultJson?.profile ?? doc.resultJson ?? null,
      stats: doc.resultJson?.stats ?? null,
      sampling: doc.resultJson?.sampling ?? null,

      // preview-safe
      insightsPreview,

      // full-only
      characteristicPosts,

      // full-only: полные инсайты (с evidencePosts)
      // ChannelAnalyzerReport сейчас это не рендерит — но данные будут в result для дальнейшей унификации.
      insights: fullAllowed ? doc.insights ?? [] : [],

      _result: {
        channel: doc.channel,
        analyzerVersion: doc.analyzerVersion,
        analyzedAt: doc.analyzedAt,
      },
    };

    const meta = {
      ...asRecord(doc?.meta),
      // служебные поля — в конце, чтобы их нельзя было перезаписать данными из Payload
      access,
      shareOk,
      isAuthed,
      isAnonymousReport,
    };

    return NextResponse.json({
      ok: true,
      access,
      preview,
      result,
      meta,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}