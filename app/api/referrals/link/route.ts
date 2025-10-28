import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// POST /api/referrals/link - Link current user to referrer if they have a referral code cookie
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the referral code from cookies
    const cookieStore = cookies();
    const refCookie = cookieStore.get("ref");

    if (!refCookie?.value) {
      return NextResponse.json(
        { error: "No referral code found" },
        { status: 400 }
      );
    }

    const referralCode = refCookie.value;

    // Check if user already has a referrer
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referredById: true },
    });

    if (currentUser?.referredById) {
      return NextResponse.json({
        success: true,
        message: "User already has a referrer",
        alreadyLinked: true,
      });
    }

    // Find the referrer by their referral code
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: { id: true, name: true },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Don't allow users to refer themselves
    if (referrer.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot refer yourself" },
        { status: 400 }
      );
    }

    // Link the user to the referrer
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referredById: referrer.id },
    });

    // Clear the referral cookie
    const response = NextResponse.json({
      success: true,
      message: `Successfully linked to referrer: ${
        referrer.name || "Anonymous"
      }`,
      referrerId: referrer.id,
    });

    response.cookies.set("ref", "", { maxAge: 0 });

    return response;
  } catch (error) {
    console.error("Error linking referral:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
