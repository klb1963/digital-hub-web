// src/lib/email.ts

import nodemailer from "nodemailer";

// ---------------- Типы ----------------

type ContactData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

// ---------------- ENV ----------------

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser || "";

// Более точная диагностика env-переменных
const missingEnv: string[] = [];
if (!smtpHost) missingEnv.push("SMTP_HOST");
if (!smtpUser) missingEnv.push("SMTP_USER");
if (!smtpPass) missingEnv.push("SMTP_PASS");
if (!receiverEmail) missingEnv.push("CONTACT_RECEIVER_EMAIL");
if (!fromEmail) missingEnv.push("CONTACT_FROM_EMAIL (или SMTP_USER)");

if (missingEnv.length > 0) {
  console.warn(
    "[contact-email] Missing email env vars:",
    missingEnv.join(", ")
  );
}

// ---------------- Транспорт ----------------

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// 🟩 Диагностика SMTP-конфига (без пароля)
console.log("SMTP CONFIG:", {
  host: smtpHost,
  port: smtpPort,
  user: smtpUser,
});

transporter.verify((error: Error | null) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP VERIFY: server is ready to send mail.");
  }
});

// ---------------- Contact form ----------------

export async function sendContactEmails(data: ContactData) {
  const { name, email, phone, message } = data;

  if (!receiverEmail || !fromEmail) {
    console.error(
      "[sendContactEmails] receiverEmail/fromEmail not configured, email not sent."
    );
    return;
  }

  const ownerMail = {
    from: fromEmail,
    to: receiverEmail,
    replyTo: email,
    subject: `Новая заявка: ${name}`,
    text: `
Имя: ${name}
Email: ${email}
Телефон: ${phone || "-"}
Сообщение:
${message}
    `.trim(),
  };

  const clientMail = {
    from: fromEmail,
    to: email,
    subject: "Ваш запрос получен",
    text: `
Здравствуйте, ${name}!

Спасибо за сообщение. Я прочитаю его и свяжусь с вами лично.

Ваше сообщение:
${message}

С уважением,
Leonid
Open Digital Hub
    `.trim(),
  };

  await transporter.sendMail(ownerMail);
  await transporter.sendMail(clientMail);
}

// ---------------- Get Started ----------------

export type GetStartedEmailPayload = {
  name: string;
  email: string;
  interests: string[];
  projectSummary: string;
  expectedValue: string;
  collaborationFormat: string;
  aboutLinks: string;
  extra?: string;
  company?: string; // 🛡️ honeypot — боты заполняют, человек нет
};

// Заявки "Get Started"
export async function sendGetStartedEmails(payload: GetStartedEmailPayload) {
  const {
    name,
    email,
    interests,
    projectSummary,
    expectedValue,
    collaborationFormat,
    aboutLinks,
    extra,
  } = payload;

  if (!receiverEmail || !fromEmail) {
    console.error(
      "[sendGetStartedEmails] receiverEmail/fromEmail not configured, email not sent."
    );
    return;
  }

  const interestsText =
    interests && interests.length > 0 ? interests.join(", ") : "— не указано —";

  const ownerSubject =
    "Новая заявка Get Started с сайта Open Digital Hub";
  const ownerText = `
Новая заявка "Get Started" с сайта.

Имя: ${name}
Email: ${email}

Что интересует сейчас:
${interestsText}

Краткая суть проекта / проблемы:
${projectSummary}

Какая часть опыта кажется полезной:
${expectedValue || "— не указано —"}

Формат взаимодействия:
${collaborationFormat || "— не указано —"}

Где можно узнать о клиенте / проекте:
${aboutLinks || "— не указано —"}

Дополнительные комментарии:
${extra || "— нет —"}
  `.trim();

  const clientSubject = "Спасибо за вашу заявку (Open Digital Hub)";
  const clientText = `
Здравствуйте, ${name}!

Спасибо за то, что заполнили анкету Get Started.
Я внимательно прочитаю её и вернусь к вам с ответом и предложением по формату
в ближайшее время.

Если нужно что-то добавить — просто ответьте на это письмо.

С уважением,
Leonid Kleimann
Software Architect & AI-Product Engineer
  `.trim();

  // Письмо мне
  await transporter.sendMail({
    from: fromEmail,
    to: receiverEmail,
    replyTo: email,
    subject: ownerSubject,
    text: ownerText,
  });

  // Письмо клиенту
  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: clientSubject,
    text: clientText,
  });
}