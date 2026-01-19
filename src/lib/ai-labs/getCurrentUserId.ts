// src/lib/ai-labs/getCurrentUserId.ts

import { auth } from '@clerk/nextjs/server'

export async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('UNAUTHORIZED')
  }

  return userId
}