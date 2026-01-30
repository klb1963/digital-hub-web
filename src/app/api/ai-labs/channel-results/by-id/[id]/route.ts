// src/app/api/ai-labs/channel-results/[id]/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPayloadServiceToken } from "@/lib/ai-labs/getPayloadServiceToken";

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || "http://localhost:3000";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const token = await getPayloadServiceToken();


    // 1) read doc to verify ownership
    const readRes = await fetch(
      `${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `JWT ${token}` },
        cache: "no-store",
      }
    );

    if (readRes.status === 404) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    if (!readRes.ok) {
      const text = await readRes.text();
      return NextResponse.json({ error: "PAYLOAD_READ_FAILED", details: text }, { status: 500 });
    }

    const readJson = await readRes.json();
    const doc = readJson?.doc ?? readJson;

    // 🔒 ownership check
    if (String(doc?.userId ?? "") !== String(userId)) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // 2) delete
    const res = await fetch(
      `${PAYLOAD_API_URL}/api/ai-labs-channel-analysis-results/${encodeURIComponent(id)}`,
      {
       method: "DELETE",
       headers: { Authorization: `JWT ${token}` },
       cache: "no-store", 
       }
    );  

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "PAYLOAD_DELETE_FAILED", details: text }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message }, { status: 500 });
  }
}