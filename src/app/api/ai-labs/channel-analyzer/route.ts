// src/app/api/ai-labs/channel-analyzer/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/ai-labs/getCurrentUserId'
import { getPayloadServiceToken } from '@/lib/ai-labs/getPayloadServiceToken'

function normalizeChannel(input: string): string {
  return input.trim().replace(/^https?:\/\/t\.me\//, '').replace(/^@/, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { channelInput, reportLanguage, depth, purposeHint } = body

    const userId = getCurrentUserId(req)

    const channel = normalizeChannel(channelInput)

    const token = await getPayloadServiceToken()

    const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'

    const res = await fetch(`${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        userId,
        channel,
        reportLanguage,
        depth,
        purposeHint,
        status: 'PROCESSING',
        analyzerVersion: 'v1',
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'PAYLOAD_CREATE_FAILED', details: text }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ requestId: created.doc?.id ?? created.id })
    } catch (e: unknown) {
        const message =
            e instanceof Error ? e.message : 'Unknown error'

        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message },
            { status: 500 }
        )
    }
}