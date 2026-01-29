// src/app/api/ai-labs/channel-analyzer/[id]/route.ts

import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/ai-labs/getCurrentUserId'
import { getPayloadServiceToken } from '@/lib/ai-labs/getPayloadServiceToken'
import type { InsightPreview } from '@/lib/ai-labs/types'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'

function asRecord(x: unknown): Record<string, unknown> {
  return typeof x === 'object' && x !== null ? (x as Record<string, unknown>) : {}
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params

    // open scenario: allow anonymous polling for open_v1/anonym requests
    let currentUserId: string | null = null
    try {
      currentUserId = await getCurrentUserId()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      if (msg !== 'UNAUTHORIZED') {
        throw e
      }
      // keep null
    }

    const token = await getPayloadServiceToken()

    // 1) читаем request
    const reqRes = await fetch(
      `${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-requests/${id}`,
      {
        headers: { Authorization: `JWT ${token}` },
        cache: 'no-store',
      }
    )

    if (reqRes.status === 404) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
    }

    if (!reqRes.ok) {
      const text = await reqRes.text()
      return NextResponse.json(
        { error: 'PAYLOAD_READ_REQUEST_FAILED', details: text },
        { status: 500 }
      )
    }

    const requestJson = await reqRes.json()
    const request = requestJson?.doc ?? requestJson

    const isOpen =
      String(request?.userId ?? '') === 'anonym' ||
      String(request?.analyzerVersion ?? '') === 'open_v1'

    if (!isOpen) {
      if (!currentUserId) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
      }
      if (String(request?.userId ?? '') !== String(currentUserId)) {
        return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
      }
    }

    if (request?.status !== 'READY') {
      return NextResponse.json({
        status: request?.status ?? 'UNKNOWN',
        error: request?.error ?? null,
      })
    }

    // 2) читаем result по request relationship
    const qs = new URLSearchParams({
      'where[request][equals]': id,
      limit: '1',
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

    const resultJson = await resRes.json()
    const doc = resultJson?.docs?.[0]

    // unified gating flag for UI (ChannelAnalyzerReport смотрит на meta.access)
    const access: 'preview' | 'full' = currentUserId ? 'full' : 'preview'

    const insightsPreview: Pick<InsightPreview, 'title' | 'summary' | 'why'>[] =
      (doc?.insights as InsightPreview[] | undefined)
        ?.slice(0, 3)
        .map((x) => ({ title: x.title, summary: x.summary, why: x.why ?? null })) ?? []

    return NextResponse.json({
      status: 'READY',
      result: doc
        ? {
            ...(doc.resultJson ?? null),
            // structured v1.1 blocks
            period: doc.period ?? null,
            metrics: doc.metrics ?? null,
            characteristicPosts: doc.characteristicPosts ?? [],
            insightsPreview,
            // for link building on /ai-labs
            _result: {
              id: doc.id,
              channel: doc.channel,
              analyzerVersion: doc.analyzerVersion,
              analyzedAt: doc.analyzedAt,
            },
          }
        : null,
      meta: doc
        ? { ...asRecord(doc?.meta), access }
        : { access },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: 'INTERNAL_ERROR', message }, { status: 500 })
  }
}