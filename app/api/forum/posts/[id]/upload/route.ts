import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadForumImage, extractFileFromFormData } from "@/lib/blob-upload";
import { isAdmin } from "@/lib/forum-auth";

// POST - Upload image attachment to post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the post
    const post = await prisma.ez_forum_posts.findUnique({
      where: { id: params.id },
    });

    if (!post || post.isDeleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user can upload (must be post author or admin)
    const isAdminUser = isAdmin(session.user.role);
    const isAuthor = post.authorId === session.user.id;

    if (!isAdminUser && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = await extractFileFromFormData(formData, "image");

    // Upload to Vercel Blob
    const uploadResult = await uploadForumImage(file);

    // Save attachment record
    const attachment = await prisma.ez_forum_attachments.create({
      data: {
        postId: params.id,
        url: uploadResult.url,
        filename: uploadResult.filename,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        width: uploadResult.width,
        height: uploadResult.height,
      },
    });

    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
