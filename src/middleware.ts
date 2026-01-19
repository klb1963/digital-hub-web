import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/auth/(.*)',
])

export default clerkMiddleware(async (auth, req) => {

console.log('[middleware] executed:', req.nextUrl.pathname)

  if (!isProtectedRoute(req)) {
    return NextResponse.next()
  }

  const { userId } = await auth()

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|favicon.ico).*)',
    '/api/ai-labs/(.*)',
  ],
}