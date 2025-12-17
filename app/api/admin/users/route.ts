import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/users - Get all EZ Casino users with sites and details
export async function GET(req: NextRequest) {
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

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "25");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const hasSites = url.searchParams.get("hasSites"); // "true", "false", or null for all

    // Build where clause - only show users with ezcasino access
    const whereConditions: any[] = [{ ezcasino: true }];

    if (searchQuery) {
      whereConditions.push({
        OR: [
          { email: { contains: searchQuery, mode: "insensitive" } },
          { name: { contains: searchQuery, mode: "insensitive" } },
          { id: { contains: searchQuery, mode: "insensitive" } },
          { apiKey: { contains: searchQuery, mode: "insensitive" } },
        ],
      });
    }

    if (hasSites === "true") {
      whereConditions.push({
        sites: { some: {} },
      });
    } else if (hasSites === "false") {
      whereConditions.push({
        sites: { none: {} },
      });
    }

    const where = { AND: whereConditions };

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === "sitesCount") {
      orderBy.sites = { _count: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          apiKey: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
          skype: true,
          telegram: true,
          referralCode: true,
          commissionRate: true,
          ezcasino: true,
          allmedia: true,
          sites: {
            select: {
              id: true,
              domain: true,
              name: true,
              apiKey: true,
              isActive: true,
              status: true,
              createdAt: true,
              lastAccessAt: true,
              subscription: {
                select: {
                  status: true,
                  plan: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          userCredit: {
            select: {
              balance: true,
              lifetime: true,
            },
          },
          radiumCredit: {
            select: {
              balance: true,
              lifetime: true,
            },
          },
          _count: {
            select: {
              sites: true,
              referrals: true,
              commissionsEarned: true,
            },
          },
        },
        orderBy,
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
