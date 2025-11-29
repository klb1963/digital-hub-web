// src/app/api/get-started/route.ts

import { NextResponse } from "next/server";
import { sendGetStartedEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Простая проверка обязательных полей
    if (
      !data?.name?.trim() ||
      !data?.email?.trim() ||
      !data?.projectSummary?.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await sendGetStartedEmails({
      name: data.name,
      email: data.email,
      interests: Array.isArray(data.interests) ? data.interests : [],
      projectSummary: data.projectSummary ?? "",
      expectedValue: data.expectedValue ?? "",
      collaborationFormat: data.collaborationFormat ?? "",
      aboutLinks: data.aboutLinks ?? "",
      extra: data.extra ?? "",
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Error in /api/get-started:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}