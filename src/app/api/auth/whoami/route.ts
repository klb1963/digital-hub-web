import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }

  return NextResponse.json({
    authenticated: true,
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? null,
  })
}