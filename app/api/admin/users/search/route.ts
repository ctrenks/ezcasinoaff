import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/users/search - Search for users (for admin credit management)
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

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        radiumCredit: {
          select: {
            balance: true,
            lifetime: true,
          },
        },
      },
    });

    return NextResponse.json({
      user: user
        ? {
            ...user,
            creditBalance: user.radiumCredit?.balance || 0,
            lifetimeCredits: user.radiumCredit?.lifetime || 0,
          }
        : null,
    });
  } catch (error) {
    console.error("Error searching for user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
