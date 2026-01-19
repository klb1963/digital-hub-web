// src/app/api/ai-labs/channel-analyzer/results/route.ts

import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/ai-labs/getCurrentUserId'
import { getPayloadServiceToken } from '@/lib/ai-labs/getPayloadServiceToken'

const PAYLOAD_API_URL =
  process.env.PAYLOAD_API_URL || 'http://localhost:3000'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    const token = await getPayloadServiceToken()

    const qs = new URLSearchParams({
      'where[userId][equals]': userId,
      sort: '-createdAt',
      limit: '50',
    })

    const res = await fetch(
      `${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results?${qs.toString()}`,
      {
        headers: { Authorization: `JWT ${token}` },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: 'PAYLOAD_READ_FAILED', details: text },
        { status: 500 }
      )
    }

    const json = await res.json()

    return NextResponse.json({
      items: json?.docs ?? [],
      total: json?.totalDocs ?? 0,
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}