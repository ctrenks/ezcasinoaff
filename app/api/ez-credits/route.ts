import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/ez-credits - Get user's EZ Credit balance (payment currency)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create User Credit record
    let userCredit = await prisma.userCredit.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
      },
    });

    // Create credit record if it doesn't exist
    if (!userCredit) {
      userCredit = await prisma.userCredit.create({
        data: {
          userId: session.user.id,
          balance: 0,
          lifetime: 0,
        },
        include: {
          transactions: {
            orderBy: {
              createdAt: "desc",
            },
            take: 20,
          },
        },
      });
    }

    return NextResponse.json(userCredit);
  } catch (error) {
    console.error("Error fetching EZ Credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
