import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get users with ezcasino access for PM selection
    // Only show users who have access to the EZ Casino Affiliates site
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: session.user.id, // Exclude current user
            },
          },
          {
            ezcasino: true, // Only users with EZ Casino access
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 100, // Limit to prevent overwhelming the dropdown
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
