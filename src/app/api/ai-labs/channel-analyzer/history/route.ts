// src/app/api/ai-labs/channel-analyzer/history/route.ts

import { NextResponse } from "next/server";

type PayloadFindResponse<TDoc = unknown> = {
  docs?: TDoc[];
  totalDocs?: number;
  limit?: number;
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
};

function pickPayloadBaseUrl(): string | null {
  const v =
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_URL ||
    "";
  const s = v.trim();
  return s ? s.replace(/\/+$/, "") : null;
}

export async function GET( ) {
  // TODO: взять userId из auth (Clerk)
  const userId = "DEV_USER";

  const baseUrl = pickPayloadBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      {
        error: "PAYLOAD_URL_MISSING",
        message:
          "Set PAYLOAD_PUBLIC_SERVER_URL (or PAYLOAD_URL/NEXT_PUBLIC_PAYLOAD_URL) in env.",
      },
      { status: 500 }
    );
  }

  const url = new URL("/api/ai-labs-channel-analysis-requests", baseUrl);
  // Payload REST: where[field][equals]=value
  url.searchParams.set("where[userId][equals]", userId);
  url.searchParams.set("sort", "-createdAt");
  url.searchParams.set("limit", "50");

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    // Если коллекция закрыта и требует auth — добавим тут токен (позже).
    // headers: { Authorization: `Bearer ${process.env.PAYLOAD_SERVICE_TOKEN}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      {
        error: "PAYLOAD_REQUEST_FAILED",
        status: res.status,
        details: text.slice(0, 800),
      },
      { status: 502 }
    );
  }

  const data = (await res.json()) as PayloadFindResponse;
  const items = Array.isArray(data?.docs) ? data.docs : [];

  return NextResponse.json({ items });
}