import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.ez_forum_posts.findUnique({
      where: { id: params.id },
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

    if (!post || post.isDeleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH - Update post
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
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await prisma.ez_forum_posts.findUnique({
      where: { id: params.id },
    });

    if (!post || post.isDeleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check permissions
    const isAdmin = session.user.role === 1 || session.user.role === 0;
    const isAuthor = post.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedPost = await prisma.ez_forum_posts.update({
      where: { id: params.id },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
        editedBy: session.user.id,
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

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete post (soft delete for users, hard delete for admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.ez_forum_posts.findUnique({
      where: { id: params.id },
      include: {
        topic: true,
      },
    });

    if (!post || post.isDeleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check permissions
    const isAdmin = session.user.role === 1 || session.user.role === 0;
    const isAuthor = post.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get first post in topic
    const firstPost = await prisma.ez_forum_posts.findFirst({
      where: { topicId: post.topicId },
      orderBy: { createdAt: "asc" },
    });

    // Prevent deleting the first post (it's the topic content)
    if (firstPost?.id === post.id) {
      return NextResponse.json(
        { error: "Cannot delete the first post. Delete the topic instead." },
        { status: 400 }
      );
    }

    if (isAdmin) {
      // Admins can hard delete
      await prisma.$transaction(async (tx) => {
        await tx.ez_forum_posts.delete({
          where: { id: params.id },
        });

        // Decrement reply count
        await tx.ez_forum_topics.update({
          where: { id: post.topicId },
          data: {
            replyCount: { decrement: 1 },
          },
        });
      });
    } else {
      // Regular users do soft delete
      await prisma.ez_forum_posts.update({
        where: { id: params.id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: session.user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
