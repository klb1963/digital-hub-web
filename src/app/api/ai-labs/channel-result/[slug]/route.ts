// src/app/api/ai-labs/channel-result/[slug]/route.ts

import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/ai-labs/getCurrentUserId'
import { getPayloadServiceToken } from '@/lib/ai-labs/getPayloadServiceToken'
import type { InsightPreview } from '@/lib/ai-labs/types'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'

function normalizeSlug(input: string) {
  return String(input || '').trim().replace(/^@/, '')
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params
    const url = new URL(req.url)

    const channel = normalizeSlug(slug)
    const analyzerVersion = url.searchParams.get('v') || 'open_v1'
    const share = url.searchParams.get('share') || ''

    // auth (optional)
    let currentUserId: string | null = null
    try {
      currentUserId = await getCurrentUserId()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      if (msg !== 'UNAUTHORIZED') throw e
    }

    const token = await getPayloadServiceToken()

    // find last result for channel+version
    const qs = new URLSearchParams({
      "where[channel][equals]": channel,
      "where[analyzerVersion][equals]": analyzerVersion,
      "limit": "1",
      "sort": "-analyzedAt",
    })

    const resRes = await fetch(
      `${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results?${qs.toString()}`,
      {
        headers: { Authorization: `JWT ${token}` },
        cache: 'no-store',
      }
    )

    if (!resRes.ok) {
      const text = await resRes.text()
      return NextResponse.json(
        { error: 'PAYLOAD_READ_RESULT_FAILED', details: text },
        { status: 500 }
      )
    }

    const json = await resRes.json()
    const doc = json?.docs?.[0]
    if (!doc) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
    }

    // Gate full access:
    // - signed in OR share token matches doc.meta.shareToken (if present)
    const metaShare = String(doc?.meta?.shareToken || '')
    const shareOk = !!share && !!metaShare && share === metaShare
    const fullAllowed = !!currentUserId || shareOk

    const insightsPreview: Pick<InsightPreview, 'title' | 'summary' | 'why'>[] =
      (doc.insights as InsightPreview[] | undefined)
        ?.slice(0, 2)
        .map((x) => ({ title: x.title, summary: x.summary, why: x.why ?? null })) ?? []

    // preview is always allowed
    const preview = {
      channel: doc.channel,
      analyzerVersion: doc.analyzerVersion,
      analyzedAt: doc.analyzedAt,
      reportLanguage: doc.reportLanguage,
      depth: doc.depth,
      period: doc.period ?? null,
      metrics: doc.metrics ?? null,
      // preview payload uses resultJson.profile + resultJson.stats
      profile: doc.resultJson?.profile ?? doc.resultJson ?? null,
      stats: doc.resultJson?.stats ?? null,
      characteristicPosts: doc.characteristicPosts ?? [],

      // 1–2 insight only (top + worst) if exists, but still preview-safe (without evidence texts)
          insightsPreview,
      }

    if (!fullAllowed) {
      return NextResponse.json({ ok: true, access: 'preview', preview })
    }

    // full
    return NextResponse.json({
      ok: true,
      access: 'full',
      preview,
      full: {
        insights: doc.insights ?? [],
        // если захочешь отдельно: evidence внутри insights уже есть
      },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: 'INTERNAL_ERROR', message }, { status: 500 })
  }
}