import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createBulkNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/notifications/broadcast
 * Broadcast a custom notification to all users or specific users (admin only)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins (role 5) can broadcast notifications
    if (session.user.role !== 5) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, link, icon, type, userIds, targetAllUsers } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Missing required fields: title, message" },
        { status: 400 }
      );
    }

    let recipientIds: string[];

    if (targetAllUsers) {
      // Get all active users with ezcasino access
      const users = await prisma.user.findMany({
        where: {
          ezcasino: true,
        },
        select: {
          id: true,
        },
      });
      recipientIds = users.map((u) => u.id);
    } else if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      // Send to specific users
      recipientIds = userIds;
    } else {
      return NextResponse.json(
        {
          error:
            "Must specify either targetAllUsers: true or provide userIds array",
        },
        { status: 400 }
      );
    }

    // Send notifications
    const result = await createBulkNotifications(recipientIds, {
      type: type || "SYSTEM",
      title,
      message,
      link,
      icon: icon || "📢",
      metadata: {
        sentBy: session.user.name || session.user.email,
        sentAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${recipientIds.length} user(s)`,
      count: recipientIds.length,
      result,
    });
  } catch (error: any) {
    console.error("Error broadcasting notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to broadcast notification" },
      { status: 500 }
    );
  }
}
