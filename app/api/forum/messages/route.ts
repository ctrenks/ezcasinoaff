import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendPMNotification } from "@/lib/forum-email";

// GET - List user's messages (inbox)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Get messages where user is a participant
    const [participations, total] = await Promise.all([
      prisma.ez_forum_message_participants.findMany({
        where: {
          userId: session.user.id,
          isDeleted: false,
        },
        orderBy: {
          message: {
            createdAt: "desc",
          },
        },
        skip,
        take: limit,
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
                where: {
                  userId: { not: session.user.id },
                },
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
      }),
      prisma.ez_forum_message_participants.count({
        where: {
          userId: session.user.id,
          isDeleted: false,
        },
      }),
    ]);

    // Transform data for easier consumption
    const messages = participations.map((p) => ({
      id: p.message.id,
      subject: p.message.subject,
      content: p.message.content,
      sender: p.message.sender,
      recipients: p.message.participants.map((r) => r.user),
      isRead: p.isRead,
      readAt: p.readAt,
      createdAt: p.message.createdAt,
    }));

    // Get unread count
    const unreadCount = await prisma.ez_forum_message_participants.count({
      where: {
        userId: session.user.id,
        isRead: false,
        isDeleted: false,
      },
    });

    return NextResponse.json({
      messages,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send new message
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let { recipientId, recipientIds, subject, content } = body;

    // Support both single recipientId and multiple recipientIds
    if (recipientId && !recipientIds) {
      recipientIds = [recipientId];
    }

    if (
      !recipientIds ||
      !Array.isArray(recipientIds) ||
      recipientIds.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one recipient is required" },
        { status: 400 }
      );
    }

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    // Verify all recipients exist and get their email addresses
    const recipients = await prisma.user.findMany({
      where: {
        id: { in: recipientIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (recipients.length !== recipientIds.length) {
      return NextResponse.json(
        { error: "One or more recipients not found" },
        { status: 400 }
      );
    }

    // Create message with participants
    const message = await prisma.ez_forum_private_messages.create({
      data: {
        senderId: session.user.id,
        subject,
        content,
        participants: {
          create: [
            // Add sender as participant (mark as read)
            {
              userId: session.user.id,
              isRead: true,
              readAt: new Date(),
            },
            // Add recipients
            ...recipientIds.map((recipientId: string) => ({
              userId: recipientId,
              isRead: false,
            })),
          ],
        },
      },
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
    });

    // Send email notifications to recipients (asynchronously)
    const senderName = session.user.name || "A forum user";
    recipients.forEach(async (recipient) => {
      try {
        await sendPMNotification({
          recipientEmail: recipient.email,
          recipientName: recipient.name || "Forum User",
          senderName,
          messageSubject: subject,
          messageId: message.id,
        });
      } catch (error) {
        console.error(
          `Failed to send PM notification to ${recipient.email}:`,
          error
        );
        // Don't fail the request if email fails
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
