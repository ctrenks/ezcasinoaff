import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { notifyNewCasino } from "@/lib/notifications";

/**
 * POST /api/admin/notifications/casino
 * Send notification to all users about a new casino (admin only)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins (role 5) can send notifications
    if (session.user.role !== 5) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { casinoName, casinoId } = body;

    if (!casinoName || !casinoId) {
      return NextResponse.json(
        { error: "Missing required fields: casinoName, casinoId" },
        { status: 400 }
      );
    }

    // Send notifications to all users
    const result = await notifyNewCasino(casinoName, casinoId);

    return NextResponse.json({
      success: true,
      message: `Notifications sent to all users about ${casinoName}`,
      result,
    });
  } catch (error: any) {
    console.error("Error sending casino notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}
