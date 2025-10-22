import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/sites/[id] - Get site details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const site = await prisma.site.findFirst({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure user owns this site
      },
      include: {
        subscription: {
          include: {
            payments: {
              orderBy: {
                createdAt: "desc",
              },
              take: 5,
            },
          },
        },
        apiUsage: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        radiumUsage: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error fetching site:", error);
    return NextResponse.json(
      { error: "Failed to fetch site" },
      { status: 500 }
    );
  }
}

// PATCH /api/sites/[id] - Update site
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

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

    // Update the site
    const updatedSite = await prisma.site.update({
      where: {
        id: params.id,
      },
      data: {
        name: name || existingSite.name,
        description:
          description !== undefined ? description : existingSite.description,
        updatedAt: new Date(),
      },
      include: {
        subscription: true,
      },
    });

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 }
    );
  }
}

// DELETE /api/sites/[id] - Delete site
export async function DELETE(
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
      include: {
        subscription: true,
      },
    });

    if (!existingSite) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Check if site has active subscription
    if (
      existingSite.subscription &&
      existingSite.subscription.status === "ACTIVE"
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete site with active subscription. Please cancel the subscription first.",
        },
        { status: 400 }
      );
    }

    // Delete the site (cascade will handle related records)
    await prisma.site.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Site deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 }
    );
  }
}
