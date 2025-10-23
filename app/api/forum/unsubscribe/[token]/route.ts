import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Find the follower by unsubscribe token
    const follower = await prisma.ez_forum_topic_followers.findUnique({
      where: { unsubscribeToken: token },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!follower) {
      return new NextResponse(
        `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invalid Unsubscribe Link</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
    }
    .error { color: #dc2626; }
  </style>
</head>
<body>
  <h1 class="error">❌ Invalid Unsubscribe Link</h1>
  <p>This unsubscribe link is invalid or has already been used.</p>
  <p><a href="https://www.ezcasinoaff.com/forum">Return to Forum</a></p>
</body>
</html>
        `,
        {
          status: 404,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Delete the follower record (unsubscribe)
    await prisma.ez_forum_topic_followers.delete({
      where: { id: follower.id },
    });

    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed Successfully</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
    }
    .success {
      color: #059669;
      font-size: 48px;
    }
    .topic {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: bold;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="success">✅</div>
  <h1>Unsubscribed Successfully</h1>
  <p>You have been unsubscribed from email notifications for:</p>
  <div class="topic">${follower.topic.title}</div>
  <p>You will no longer receive email notifications when someone replies to this topic.</p>
  <p style="color: #6b7280; font-size: 14px;">
    You can re-subscribe at any time by visiting the topic and clicking "Follow Topic".
  </p>
  <a href="https://www.ezcasinoaff.com/forum/topic/${follower.topic.slug}" class="btn">
    View Topic
  </a>
  <br>
  <a href="https://www.ezcasinoaff.com/forum" style="margin-top: 15px; display: inline-block; color: #667eea;">
    Return to Forum
  </a>
</body>
</html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
    }
    .error { color: #dc2626; }
  </style>
</head>
<body>
  <h1 class="error">⚠️ Error</h1>
  <p>An error occurred while processing your request.</p>
  <p><a href="https://www.ezcasinoaff.com/forum">Return to Forum</a></p>
</body>
</html>
      `,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
