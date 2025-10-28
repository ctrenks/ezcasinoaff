import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/credits/transactions - Get User Credit transaction history (EZ Credits)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const type = searchParams.get("type"); // Filter by transaction type

    const where: any = {
      userId: session.user.id,
    };

    if (type) {
      where.type = type;
    }

    const [transactions, total] = await Promise.all([
      prisma.userCreditTransaction.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.userCreditTransaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching User Credit transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
