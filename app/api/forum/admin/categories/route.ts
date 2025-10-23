import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/forum-utils";
import { isAdmin } from "@/lib/forum-auth";

// GET - List all categories (admin view with inactive ones)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is admin (role 5 only)
    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.ez_forum_categories.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { topics: true },
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

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is admin (role 5 only)
    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = createSlug(name);

    // Check if slug already exists
    const existing = await prisma.ez_forum_categories.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    // Get the highest display order
    const lastCategory = await prisma.ez_forum_categories.findFirst({
      orderBy: { displayOrder: "desc" },
    });

    const displayOrder = (lastCategory?.displayOrder || 0) + 1;

    // Create category
    const category = await prisma.ez_forum_categories.create({
      data: {
        name,
        slug,
        description,
        icon,
        displayOrder,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
