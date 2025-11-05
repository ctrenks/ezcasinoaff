import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Verify reCAPTCHA v3 token
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );

    const data = await response.json();

    // For reCAPTCHA v3, check score (0.0 - 1.0, higher is better)
    console.log(`reCAPTCHA score: ${data.score}`);
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, phone, recaptchaToken } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Honeypot check - if filled, pretend to succeed but don't send email
    if (phone && phone.trim() !== "") {
      console.log("Honeypot triggered - bot detected:", { name, email });
      // Return success to fool the bot
      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      });
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"EZ Casino Affiliates Contact" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: "support@ezcasinoaff.com",
      replyTo: email,
      subject: subject
        ? `Contact Form: ${subject}`
        : `Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
            .value { color: #1f2937; font-size: 16px; }
            .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #9333ea; margin-top: 10px; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From</div>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #9333ea;">${email}</a></div>
              </div>

              ${
                subject
                  ? `
              <div class="field">
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
              </div>
              `
                  : ""
              }

              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>

              <div class="field">
                <div class="label">Received</div>
                <div class="value">${new Date().toLocaleString("en-US", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}</div>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">EZ Casino Affiliates Contact Form</p>
              <p style="margin: 5px 0 0 0;">This is an automated message from your website contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ""}

Message:
${message}

Received: ${new Date().toLocaleString()}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("Contact form email sent successfully:", { name, email });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
