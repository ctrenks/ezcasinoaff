import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/referrals/commission-rate - Update a user's commission rate
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is super admin (role 0)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 0) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, commissionRate } = body;

    if (!userId || typeof commissionRate !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: userId and commissionRate" },
        { status: 400 }
      );
    }

    if (commissionRate < 0 || commissionRate > 100) {
      return NextResponse.json(
        { error: "Commission rate must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Update the user's commission rate
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { commissionRate },
      select: {
        id: true,
        name: true,
        email: true,
        commissionRate: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating commission rate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/referrals/commission-rate - Get all users with their commission rates
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is super admin (role 0)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== 0) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "50");

    const where = searchQuery
      ? {
          OR: [
            { email: { contains: searchQuery, mode: "insensitive" as const } },
            { name: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          commissionRate: true,
          referralCode: true,
          createdAt: true,
          _count: {
            select: {
              referrals: true,
              commissionsEarned: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
