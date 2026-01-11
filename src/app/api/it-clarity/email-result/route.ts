// digital-hub-web/src/app/it-clarity/email-result/route.ts

import { NextResponse } from 'next/server';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as null | {
    email: string;
    level: 'GREEN' | 'YELLOW' | 'RED';
    persona: string;
    pageUrl?: string;
  };

  if (!body || !isValidEmail(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const PAYLOAD_URL =
    process.env.CMS_INTERNAL_URL ||
    process.env.CMS_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_URL;

  if (!PAYLOAD_URL) {
    return NextResponse.json({ error: 'CMS url is not configured' }, { status: 500 });
  }

  const submission = {
    type: 'it-clarity-result',
    name: 'IT Clarity (auto)', // потому что name required:true
    email: body.email.trim().toLowerCase(),
    payload: {
      source: 'it-clarity',
      level: body.level,
      persona: body.persona,
      pageUrl: body.pageUrl || null,
    },
  };

  const r = await fetch(`${PAYLOAD_URL}/api/form-submissions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(submission),
    cache: 'no-store',
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    return NextResponse.json(
      { error: `Payload error: ${r.status}`, details: txt.slice(0, 800) },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

