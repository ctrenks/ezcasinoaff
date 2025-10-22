import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateDemoApiKey } from "@/lib/api-key";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate new demo API key
    const newApiKey = generateDemoApiKey();

    // Update user with new API key
    await prisma.user.update({
      where: { id: session.user.id },
      data: { apiKey: newApiKey },
    });

    return NextResponse.json({
      success: true,
      apiKey: newApiKey,
      message: "New API key generated successfully",
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json(
      { error: "Failed to generate API key" },
      { status: 500 }
    );
  }
}
