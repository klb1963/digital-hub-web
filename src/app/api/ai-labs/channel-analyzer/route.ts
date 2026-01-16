// src/app/api/ai-labs/channel-analyzer/route.ts

import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_SERVICE_EMAIL || ''
const PASSWORD = process.env.PAYLOAD_SERVICE_PASSWORD || ''

async function getPayloadToken(): Promise<string> {
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      `Missing credentials: email="${EMAIL}", passwordLength=${PASSWORD.length}`
    )
  }

  const res = await fetch(`${PAYLOAD_API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Payload login failed (${res.status}) with email="${EMAIL}": ${text}`
    )
  }

  const json = await res.json()

  if (!json?.token) {
    throw new Error('Payload login succeeded but token is missing')
  }

  return json.token as string
}

function normalizeChannel(input: string): string {
  return input.trim().replace(/^https?:\/\/t\.me\//, '').replace(/^@/, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { channelInput, reportLanguage, depth, purposeHint } = body

    const userId = 'DEV_USER' // позже заменим на Clerk userId
    const channel = normalizeChannel(channelInput)

    const token = await getPayloadToken()

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