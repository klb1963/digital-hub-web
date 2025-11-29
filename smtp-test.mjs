// smtp-test.mjs
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.your-server.de",
  port: 587,
  secure: false, // для 587 порт всегда false + STARTTLS
  auth: {
    user: "hello@leonidk.de",
    pass: "za73U51E3DL0ooCK",
  },
  logger: true,
  debug: true,
});

console.log("=== SMTP NODE TEST START ===");

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP TEST VERIFY ERROR:", error);
  } else {
    console.log("SMTP TEST VERIFY SUCCESS:", success);
  }
});