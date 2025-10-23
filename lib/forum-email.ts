import { forumMailer, FORUM_FROM_EMAIL, FORUM_FROM_NAME } from "./nodemailer";

const SITE_URL = process.env.NEXTAUTH_URL || "https://www.ezcasinoaff.com";

interface SendPMNotificationParams {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  messageSubject: string;
  messageId: string;
}

interface SendTopicReplyNotificationParams {
  recipientEmail: string;
  recipientName: string;
  replierName: string;
  topicTitle: string;
  topicSlug: string;
  replyContent: string;
  unsubscribeToken: string;
}

export async function sendPMNotification({
  recipientEmail,
  recipientName,
  senderName,
  messageSubject,
  messageId,
}: SendPMNotificationParams) {
  const messageUrl = `${SITE_URL}/forum/messages/${messageId}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📬 New Private Message</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${recipientName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      <strong>${senderName}</strong> sent you a private message on EZ Casino Affiliates Forum:
    </p>

    <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <p style="font-weight: bold; color: #667eea; margin: 0 0 10px 0;">Subject:</p>
      <p style="font-size: 16px; margin: 0;">${messageSubject}</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${messageUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        📖 Read Message
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      You received this email because you have an account on EZ Casino Affiliates.
      You can manage your notification settings in your profile.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© ${new Date().getFullYear()} EZ Casino Affiliates. All rights reserved.</p>
  </div>
</body>
</html>
  `;

  const text = `
Hi ${recipientName},

${senderName} sent you a private message on EZ Casino Affiliates Forum.

Subject: ${messageSubject}

Read the message: ${messageUrl}

---
You received this email because you have an account on EZ Casino Affiliates.
  `;

  try {
    await forumMailer.sendMail({
      from: `${FORUM_FROM_NAME} <${FORUM_FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `New Private Message from ${senderName}`,
      text,
      html,
    });
    console.log(`PM notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending PM notification:", error);
    throw error;
  }
}

export async function sendTopicReplyNotification({
  recipientEmail,
  recipientName,
  replierName,
  topicTitle,
  topicSlug,
  replyContent,
  unsubscribeToken,
}: SendTopicReplyNotificationParams) {
  const topicUrl = `${SITE_URL}/forum/topic/${topicSlug}`;
  const unsubscribeUrl = `${SITE_URL}/api/forum/unsubscribe/${unsubscribeToken}`;

  // Strip HTML tags and truncate reply content for preview
  const plainReply = replyContent.replace(/<[^>]*>/g, "").substring(0, 200);
  const replyPreview =
    plainReply.length === 200 ? `${plainReply}...` : plainReply;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">💬 New Reply in Topic</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${recipientName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      <strong>${replierName}</strong> replied to a topic you're following:
    </p>

    <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <p style="font-weight: bold; color: #667eea; margin: 0 0 10px 0;">Topic:</p>
      <p style="font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">${topicTitle}</p>

      <p style="font-weight: bold; color: #667eea; margin: 15px 0 10px 0;">Reply Preview:</p>
      <p style="font-size: 14px; color: #6b7280; margin: 0; font-style: italic;">${replyPreview}</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${topicUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        📖 Read Full Reply
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      You're receiving this because you're following this topic.
      <a href="${unsubscribeUrl}" style="color: #ef4444; text-decoration: underline;">Unsubscribe from this topic</a>
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© ${new Date().getFullYear()} EZ Casino Affiliates. All rights reserved.</p>
  </div>
</body>
</html>
  `;

  const text = `
Hi ${recipientName},

${replierName} replied to a topic you're following on EZ Casino Affiliates Forum.

Topic: ${topicTitle}

Reply Preview: ${replyPreview}

Read the full reply: ${topicUrl}

Unsubscribe from this topic: ${unsubscribeUrl}

---
You received this email because you're following this topic.
  `;

  try {
    await forumMailer.sendMail({
      from: `${FORUM_FROM_NAME} <${FORUM_FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `New reply in "${topicTitle}"`,
      text,
      html,
    });
    console.log(`Topic reply notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending topic reply notification:", error);
    throw error;
  }
}
