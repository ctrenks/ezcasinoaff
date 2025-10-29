import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Require authentication
    if (!session?.user?.id) {
      return redirect("/auth/signin");
    }

    const { id } = params;

    // Find the plugin version
    const version = await prisma.pluginVersion.findUnique({
      where: { id },
    });

    if (!version) {
      return NextResponse.json(
        { error: "Plugin version not found" },
        { status: 404 }
      );
    }

    // Increment download counter
    await prisma.pluginVersion.update({
      where: { id },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    // Redirect to the blob URL for download
    return redirect(version.filePath);
  } catch (error) {
    console.error("Plugin download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

