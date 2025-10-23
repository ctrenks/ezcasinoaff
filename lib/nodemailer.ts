import nodemailer from "nodemailer";

// Create transporter for forum notifications (not auth)
// Auth emails will continue using Resend
export const forumMailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
forumMailer.verify(function (error, success) {
  if (error) {
    console.error("Forum mailer connection error:", error);
  } else {
    console.log("Forum mailer is ready to send emails");
  }
});

export const FORUM_FROM_EMAIL =
  process.env.FORUM_FROM_EMAIL ||
  process.env.SMTP_USER ||
  "noreply@ezcasinoaff.com";
export const FORUM_FROM_NAME = "EZ Casino Affiliates Forum";
