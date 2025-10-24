import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users who have participated in the EZ forum
    // (regardless of their current siteId, since it changes on each login)
    const forumParticipants = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: session.user.id, // Exclude current user
            },
          },
          {
            OR: [
              // Users who have created topics
              {
                forumTopics: {
                  some: {},
                },
              },
              // Users who have created posts
              {
                forumPosts: {
                  some: {},
                },
              },
            ],
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
    });

    // Also include all users for PM selection (they might want to message someone who hasn't posted yet)
    const allUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: session.user.id,
        },
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

    // Use all users for better UX
    const users = allUsers;

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
