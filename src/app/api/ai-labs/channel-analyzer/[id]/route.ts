// src/app/api/ai-labs/channel-analyzer/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/ai-labs/getCurrentUserId'
import { getPayloadServiceToken } from '@/lib/ai-labs/getPayloadServiceToken'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params

    const currentUserId = getCurrentUserId(_req)

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

    if (String(request?.userId ?? '') !== String(currentUserId)) {
        return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
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

    return NextResponse.json({
      status: 'READY',
      result: doc?.resultJson ?? null,
      meta: doc?.meta ?? null,
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: 'INTERNAL_ERROR', message }, { status: 500 })
  }
}