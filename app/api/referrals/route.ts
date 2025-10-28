import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// GET /api/referrals - Get current user's referral info and stats
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create referral code
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        referralCode: true,
        commissionRate: true,
        referredById: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate referral code if user doesn't have one
    if (!user.referralCode) {
      const newReferralCode = nanoid(10);
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: newReferralCode },
        select: {
          id: true,
          referralCode: true,
          commissionRate: true,
          referredById: true,
        },
      });
    }

    // Get referral stats
    const [referredUsers, totalEarnings, pendingEarnings] = await Promise.all([
      // Get all referred users with their last payment info
      prisma.user.findMany({
        where: { referredById: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          payments: {
            where: { status: "SUCCEEDED" },
            orderBy: { paidAt: "desc" },
            take: 1,
            select: {
              paidAt: true,
              amount: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Get total earnings (PAID commissions)
      prisma.affiliateCommission.aggregate({
        where: {
          referrerId: session.user.id,
          status: "PAID",
        },
        _sum: {
          amount: true,
        },
      }),
      // Get pending earnings
      prisma.affiliateCommission.aggregate({
        where: {
          referrerId: session.user.id,
          status: "PENDING",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Get detailed commission history
    const commissions = await prisma.affiliateCommission.findMany({
      where: { referrerId: session.user.id },
      include: {
        referredUser: {
          select: {
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            amount: true,
            paidAt: true,
            currency: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Last 50 commissions
    });

    // Build referral URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const referralUrl = `${baseUrl}/auth/signin?ref=${user.referralCode}`;

    return NextResponse.json({
      referralCode: user.referralCode,
      referralUrl,
      commissionRate: user.commissionRate,
      stats: {
        totalReferrals: referredUsers.length,
        totalEarnings: totalEarnings._sum.amount || 0,
        pendingEarnings: pendingEarnings._sum.amount || 0,
      },
      referredUsers: referredUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        joinedAt: u.createdAt,
        lastPaymentDate: u.payments[0]?.paidAt || null,
        lastPaymentAmount: u.payments[0]?.amount || null,
      })),
      commissions: commissions.map((c) => ({
        id: c.id,
        amount: c.amount,
        percentage: c.percentage,
        status: c.status,
        paymentAmount: c.paymentAmount,
        referredUserName: c.referredUser.name,
        referredUserEmail: c.referredUser.email,
        paidAt: c.paidAt,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching referral data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
