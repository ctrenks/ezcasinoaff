import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Get topic by slug with posts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Get topic
    const topic = await prisma.ez_forum_topics.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.ez_forum_topics.update({
      where: { id: topic.id },
      data: { viewCount: { increment: 1 } },
    });

    // Get posts
    const [posts, totalPosts] = await Promise.all([
      prisma.ez_forum_posts.findMany({
        where: {
          topicId: topic.id,
          isDeleted: false,
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
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
      }),
      prisma.ez_forum_posts.count({
        where: {
          topicId: topic.id,
          isDeleted: false,
        },
      }),
    ]);

    return NextResponse.json({
      topic: {
        ...topic,
        viewCount: topic.viewCount + 1, // Return incremented count
      },
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

// PATCH - Update topic (pin, lock, or edit title)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, isPinned, isLocked } = body;

    const topic = await prisma.ez_forum_topics.findUnique({
      where: { slug: params.slug },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Check permissions
    const isAdmin = session.user.role === 1 || session.user.role === 0;
    const isAuthor = topic.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only admins can pin/lock topics
    if ((isPinned !== undefined || isLocked !== undefined) && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {};

    if (title !== undefined && isAuthor) {
      updateData.title = title;
    }

    if (isPinned !== undefined && isAdmin) {
      updateData.isPinned = isPinned;
    }

    if (isLocked !== undefined && isAdmin) {
      updateData.isLocked = isLocked;
    }

    const updatedTopic = await prisma.ez_forum_topics.update({
      where: { id: topic.id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ topic: updatedTopic });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

// DELETE - Delete topic
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topic = await prisma.ez_forum_topics.findUnique({
      where: { slug: params.slug },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Check permissions - only admins or topic author can delete
    const isAdmin = session.user.role === 1 || session.user.role === 0;
    const isAuthor = topic.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete topic (cascade will delete posts and attachments)
    await prisma.ez_forum_topics.delete({
      where: { id: topic.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
