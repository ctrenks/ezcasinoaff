import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSiteApiKey } from "@/lib/api-key";

// POST /api/sites/[id]/regenerate-key - Generate new API key for site
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingSite = await prisma.site.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingSite) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Generate new API key
    const newApiKey = generateSiteApiKey();

    // Update the site
    const updatedSite = await prisma.site.update({
      where: {
        id: params.id,
      },
      data: {
        apiKey: newApiKey,
        updatedAt: new Date(),
      },
      include: {
        subscription: true,
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: newApiKey,
      message:
        "API key regenerated successfully. Update it in your applications immediately.",
      site: updatedSite,
    });
  } catch (error) {
    console.error("Error regenerating API key:", error);
    return NextResponse.json(
      { error: "Failed to regenerate API key" },
      { status: 500 }
    );
  }
}
