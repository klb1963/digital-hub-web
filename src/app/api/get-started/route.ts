// src/app/api/get-started/route.ts

import { NextResponse } from "next/server";
import { sendGetStartedEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 🛡️ Honeypot: если бот заполнил скрытое поле — считаем запрос успешным,
    // но НЕ отправляем email
    if (data?.company && String(data.company).trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

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

    // ----------------------------------------
    //  📝 Сохраняем заявку "Get Started" в Payload CMS
    // ----------------------------------------
    const cmsUrl =
      process.env.CMS_INTERNAL_URL ??
      process.env.CMS_URL ??
      process.env.NEXT_PUBLIC_CMS_URL ??
      "";

    if (!cmsUrl) {
      console.warn("[get-started] No CMS URL configured — skipping logging");
    } else {
      try {
        await fetch(`${cmsUrl}/api/form-submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get-started",
            name: data.name,
            email: data.email,
            phone: data.phone ? String(data.phone) : "",
            payload: data, // сырые данные анкеты
          }),
        });
      } catch (logErr) {
        console.error(
          "[get-started] Failed to save FormSubmission in Payload:",
          logErr,
        );
        // Ошибка логирования не ломает ответ пользователю
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (err) {
    console.error("Error in /api/get-started:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}