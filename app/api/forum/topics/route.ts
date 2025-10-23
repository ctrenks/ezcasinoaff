import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/forum-utils";

// GET - List topics (with optional category filter)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [topics, total] = await Promise.all([
      prisma.ez_forum_topics.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, { lastReplyAt: "desc" }],
        skip,
        take: limit,
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
          _count: {
            select: { posts: true },
          },
        },
      }),
      prisma.ez_forum_topics.count({ where }),
    ]);

    return NextResponse.json({
      topics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

// POST - Create new topic
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { categoryId, title, content } = body;

    if (!categoryId || !title || !content) {
      return NextResponse.json(
        { error: "Category, title, and content are required" },
        { status: 400 }
      );
    }

    // Verify category exists and is active
    const category = await prisma.ez_forum_categories.findUnique({
      where: { id: categoryId },
    });

    if (!category || !category.isActive) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Create unique slug
    const slug = createUniqueSlug(title);

    // Create topic and first post in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create topic
      const topic = await tx.ez_forum_topics.create({
        data: {
          categoryId,
          authorId: session.user.id,
          title,
          slug,
          lastReplyAt: new Date(),
          lastReplyUserId: session.user.id,
        },
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

      // Create first post
      await tx.ez_forum_posts.create({
        data: {
          topicId: topic.id,
          authorId: session.user.id,
          content,
        },
      });

      // Auto-follow the topic for the author
      await tx.ez_forum_topic_followers.create({
        data: {
          topicId: topic.id,
          userId: session.user.id,
          emailNotifications: true,
        },
      });

      return topic;
    });

    return NextResponse.json({ topic: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
