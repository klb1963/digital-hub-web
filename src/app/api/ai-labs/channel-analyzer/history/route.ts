// src/app/api/ai-labs/channel-analyzer/history/route.ts

import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(_req: NextRequest) {
  // TODO: взять userId из auth (Clerk)
  const userId = 'DEV_USER'

  const requests = await payload.find({
    collection: 'ai-labs-channel-analysis-requests',
    where: {
      userId: { equals: userId },
    },
    sort: '-createdAt',
  })

  return NextResponse.json({ items: requests.docs })
}