import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

      return post;
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
