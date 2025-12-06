// src/app/api/contact/route.ts

import { NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔒 Honeypot: скрытое поле для ботов
    const rawCompany = body.company;
    const company =
      typeof rawCompany === "string" ? rawCompany.trim() : "";

    // Если поле заполнено — считаем, что это бот и тихо выходим
    if (company.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = body.phone ? String(body.phone).trim() : "";
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Простейшая проверка email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 },
      );
    }

    await sendContactEmails({ name, email, phone, message });

    // ----------------------------------------
    //  📝 Сохраняем заявку в Payload CMS
    // ----------------------------------------
    try {
      const cmsUrl = process.env.CMS_INTERNAL_URL;

      if (cmsUrl) {
        await fetch(`${cmsUrl}/api/form-submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "contact",
            name,
            email,
            phone,
            payload: body,  // сохраняем сырые данные формы
          }),
        });
      } else {
        console.warn("[contact] CMS_INTERNAL_URL not set — skipping logging");
      }
    } catch (err) {
      console.error("Failed to save form-submission in Payload:", err);
      // Ошибка сохранения не влияет на ответ пользователю
    }

    return NextResponse.json({ ok: true });
  
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}