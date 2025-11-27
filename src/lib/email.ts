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