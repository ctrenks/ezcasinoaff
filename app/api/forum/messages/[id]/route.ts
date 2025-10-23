import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Get single message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get message and user's participation
    const participation = await prisma.ez_forum_message_participants.findFirst({
      where: {
        messageId: params.id,
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        message: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!participation) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Mark as read if not already
    if (!participation.isRead) {
      await prisma.ez_forum_message_participants.update({
        where: { id: participation.id },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      message: {
        id: participation.message.id,
        subject: participation.message.subject,
        content: participation.message.content,
        sender: participation.message.sender,
        participants: participation.message.participants.map((p) => ({
          user: p.user,
          isRead: p.isRead,
          readAt: p.readAt,
        })),
        createdAt: participation.message.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

// PATCH - Mark message as read/unread
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { isRead } = body;

    if (typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "isRead must be a boolean" },
        { status: 400 }
      );
    }

    // Find user's participation
    const participation = await prisma.ez_forum_message_participants.findFirst({
      where: {
        messageId: params.id,
        userId: session.user.id,
      },
    });

    if (!participation) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Update read status
    const updated = await prisma.ez_forum_message_participants.update({
      where: { id: participation.id },
      data: {
        isRead,
        readAt: isRead ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, isRead: updated.isRead });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE - Delete message (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user's participation
    const participation = await prisma.ez_forum_message_participants.findFirst({
      where: {
        messageId: params.id,
        userId: session.user.id,
      },
    });

    if (!participation) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Soft delete for user
    await prisma.ez_forum_message_participants.update({
      where: { id: participation.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
