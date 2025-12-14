// src/app/api/og/media/%5B...path%5D/route.ts

import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

function getCmsPublicBase(): string {
  return (
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    process.env.CMS_INTERNAL_URL ||
    'https://api.leonidk.de'
  ).replace(/\/$/, '')
}

function buildUpstreamUrl(pathParts: string[]): string {
  const base = getCmsPublicBase()
  const safeParts = pathParts.filter(Boolean)

  // базовая защита от path traversal
  if (safeParts.some((p) => p.includes('..'))) {
    throw new Error('Invalid path')
  }

  // pathParts уже url-encoded, соединяем как есть
  return `${base}/api/media/file/${safeParts.join('/')}`
}

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
  wantHead: boolean,
) {
  const { path } = await ctx.params
  const upstreamUrl = buildUpstreamUrl(path)

  /**
   * КЛЮЧЕВО:
   * Payload ломается на HEAD → 404,
   * поэтому ВСЕГДА идём к нему через GET
   */
  const upstreamRes = await fetch(upstreamUrl, {
    method: 'GET',
    headers: {
      accept: req.headers.get('accept') ?? 'image/*',
      'user-agent': req.headers.get('user-agent') ?? 'TelegramBot',
    },
    redirect: 'follow',
    cache: 'no-store',
  })

  const headers = new Headers(upstreamRes.headers)

  // чистим потенциально проблемные заголовки
  headers.delete('content-encoding')
  headers.delete('content-length')

  if (!headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=3600, s-maxage=3600')
  }

  // HEAD — только заголовки
  if (wantHead) {
    return new Response(null, {
      status: upstreamRes.status,
      headers,
    })
  }

  // GET — отдаём stream
  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers,
  })
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, ctx, false)
}

export async function HEAD(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, ctx, true)
}