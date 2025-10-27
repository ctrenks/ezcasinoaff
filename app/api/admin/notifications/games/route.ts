import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { notifyNewGames } from "@/lib/notifications";

/**
 * POST /api/admin/notifications/games
 * Send notification to all users about new games (admin only)
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
    const { gameCount, provider } = body;

    if (!gameCount || gameCount <= 0) {
      return NextResponse.json(
        { error: "gameCount must be a positive number" },
        { status: 400 }
      );
    }

    // Send notifications to all users
    const result = await notifyNewGames(gameCount, provider);

    const message = provider
      ? `Notifications sent to all users about ${gameCount} new games from ${provider}`
      : `Notifications sent to all users about ${gameCount} new games`;

    return NextResponse.json({
      success: true,
      message,
      result,
    });
  } catch (error: any) {
    console.error("Error sending game notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}
