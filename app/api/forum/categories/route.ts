import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all active categories (public)
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.ez_forum_categories.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { topics: true },
        },
        topics: {
          where: {
            isLocked: false,
          },
          orderBy: {
            lastReplyAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            title: true,
            lastReplyAt: true,
            lastReplyUserId: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
