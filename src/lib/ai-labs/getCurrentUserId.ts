// src/lib/ai-labs/getCurrentUserId.ts

import type { NextRequest } from 'next/server'

export function getCurrentUserId(req: NextRequest): string {
  // dev-mode: позволяем подставлять userId руками
  const headerUserId = req.headers.get('x-user-id')?.trim()
  if (headerUserId) return headerUserId

  // временный fallback до Clerk
  return 'DEV_USER'
}