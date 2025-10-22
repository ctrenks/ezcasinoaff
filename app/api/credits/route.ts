import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/credits - Get user's credit balance and recent transactions
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create credit record
    let radiumCredit = await prisma.radiumCredit.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
          include: {
            site: {
              select: {
                name: true,
                domain: true,
              },
            },
          },
        },
      },
    });

    // Create credit record if it doesn't exist
    if (!radiumCredit) {
      radiumCredit = await prisma.radiumCredit.create({
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
            include: {
              site: {
                select: {
                  name: true,
                  domain: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json(radiumCredit);
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
