import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const version = formData.get("version") as string;
    const description = formData.get("description") as string;
    const changelog = formData.get("changelog") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!version) {
      return NextResponse.json(
        { error: "Version number required" },
        { status: 400 }
      );
    }

    // Validate version format (X.Y.Z)
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      return NextResponse.json(
        { error: "Invalid version format. Use X.Y.Z (e.g., 1.0.0)" },
        { status: 400 }
      );
    }

    // Check if version already exists
    const existingVersion = await prisma.pluginVersion.findUnique({
      where: { version },
    });

    if (existingVersion) {
      return NextResponse.json(
        { error: `Version ${version} already exists` },
        { status: 400 }
      );
    }

    // Upload file to Vercel Blob
    const blob = await put(`radium-plugin/${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Create database record
    const pluginVersion = await prisma.pluginVersion.create({
      data: {
        version,
        fileName: file.name,
        fileSize: file.size,
        filePath: blob.url,
        description: description || null,
        changelog: changelog || null,
        uploadedBy: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      version: pluginVersion,
    });
  } catch (error) {
    console.error("Plugin upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
