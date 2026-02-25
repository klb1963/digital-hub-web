import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/auth/(.*)',
])

// ✅ Боты/краулеры, которым нужен "чистый" HTML с OG-тегами без Clerk-логики
const BOT_UA =
  /(facebookexternalhit|linkedinbot|twitterbot|slackbot|telegrambot|whatsapp|discordbot|googlebot|bingbot)/i

export default clerkMiddleware(async (auth, req) => {
  // ✅ 1) early-exit для ботов
  const ua = req.headers.get('user-agent') || ''
  if (BOT_UA.test(ua)) {
    return NextResponse.next()
  }

  console.log('[middleware] executed:', req.nextUrl.pathname)

  // ✅ 2) Публичные роуты пропускаем как раньше
  if (!isProtectedRoute(req)) {
    return NextResponse.next()
  }

  // ✅ 3) Защищённые — требуют логина
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