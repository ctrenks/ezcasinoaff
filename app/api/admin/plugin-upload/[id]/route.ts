import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

// DELETE /api/admin/plugin-upload/[id] - Delete a plugin version
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Check if user is super admin (role 5)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 5) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Find the plugin version
    const pluginVersion = await prisma.pluginVersion.findUnique({
      where: { id },
    });

    if (!pluginVersion) {
      return NextResponse.json(
        { error: "Plugin version not found" },
        { status: 404 }
      );
    }

    // Delete the file from Vercel Blob
    try {
      await del(pluginVersion.filePath);
    } catch (blobError) {
      console.error("Error deleting blob file:", blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete the database record
    await prisma.pluginVersion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Plugin version ${pluginVersion.version} deleted successfully`,
    });
  } catch (error) {
    console.error("Plugin delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
