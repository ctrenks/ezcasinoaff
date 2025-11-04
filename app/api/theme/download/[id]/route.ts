import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Require authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find the theme version
    const version = await prisma.themeVersion.findUnique({
      where: { id },
    });

    if (!version) {
      return NextResponse.json(
        { error: "Theme version not found" },
        { status: 404 }
      );
    }

    // Increment download counter
    await prisma.themeVersion.update({
      where: { id },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    // Redirect to the blob URL for download
    return NextResponse.redirect(version.filePath);
  } catch (error) {
    console.error("Theme download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
