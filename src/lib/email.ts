// src/lib/email.ts

import nodemailer from "nodemailer";

type ContactData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser || "";

if (!smtpHost || !smtpUser || !smtpPass || !receiverEmail) {
  console.warn("[contact-email] Missing SMTP env vars.");
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendContactEmails(data: ContactData) {
  const { name, email, phone, message } = data;

  const ownerMail = {
    from: fromEmail,
    to: receiverEmail,
    subject: `Новая заявка: ${name}`,
    text: `
Имя: ${name}
Email: ${email}
Телефон: ${phone || "-"}
Сообщение:
${message}
    `,
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
    `,
  };

  await transporter.sendMail(ownerMail);
  await transporter.sendMail(clientMail);
}

// Добавляем рядом с другими типами (если есть) или внизу
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

// Функция для обработки заявок "Get Started"
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

  const receiver = process.env.CONTACT_RECEIVER_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "no-reply@localhost";

  if (!receiver) {
    console.error("CONTACT_RECEIVER_EMAIL is not set");
    return;
  }

  const interestsText =
    interests && interests.length > 0 ? interests.join(", ") : "— не указано —";

  const ownerSubject = "Новая заявка Get Started с сайта Open Digital Hub";
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
    to: receiver,
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