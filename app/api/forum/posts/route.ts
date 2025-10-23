import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendTopicReplyNotification } from "@/lib/forum-email";

// POST - Create new post (reply to topic)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topicId, content } = body;

    if (!topicId || !content) {
      return NextResponse.json(
        { error: "Topic ID and content are required" },
        { status: 400 }
      );
    }

    // Verify topic exists and is not locked
    const topic = await prisma.ez_forum_topics.findUnique({
      where: { id: topicId },
      include: {
        followers: {
          where: {
            emailNotifications: true,
            NOT: {
              userId: session.user.id, // Don't notify the person posting
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (topic.isLocked) {
      return NextResponse.json({ error: "Topic is locked" }, { status: 403 });
    }

    // Create post and update topic in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create post
      const post = await tx.ez_forum_posts.create({
        data: {
          topicId,
          authorId: session.user.id,
          content,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
          attachments: true,
        },
      });

      // Update topic reply count and last reply info
      await tx.ez_forum_topics.update({
        where: { id: topicId },
        data: {
          replyCount: { increment: 1 },
          lastReplyAt: new Date(),
          lastReplyUserId: session.user.id,
        },
      });

      // Auto-follow the topic for the replier (if not already following)
      await tx.ez_forum_topic_followers.upsert({
        where: {
          topicId_userId: {
            topicId,
            userId: session.user.id,
          },
        },
        create: {
          topicId,
          userId: session.user.id,
          emailNotifications: true,
        },
        update: {}, // Do nothing if already following
      });

      return post;
    });

    // Send email notifications to followers (asynchronously)
    const replierName = session.user.name || "A forum user";
    topic.followers.forEach(async (follower) => {
      try {
        await sendTopicReplyNotification({
          recipientEmail: follower.user.email,
          recipientName: follower.user.name || "Forum User",
          replierName,
          topicTitle: topic.title,
          topicSlug: topic.slug,
          replyContent: content,
          unsubscribeToken: follower.unsubscribeToken,
        });
      } catch (error) {
        console.error(
          `Failed to send topic reply notification to ${follower.user.email}:`,
          error
        );
        // Don't fail the request if email fails
      }
    });

    return NextResponse.json({ post: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
