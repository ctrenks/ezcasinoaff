import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

// POST /api/admin/credits/manual-adjust - Manually adjust user credits (for crypto payments, etc.)
export async function POST(req: NextRequest) {
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
    const { userId, amount, description, paymentMethod } = body;

    if (!userId || typeof amount !== "number" || !description) {
      return NextResponse.json(
        { error: "Missing required fields: userId, amount, description" },
        { status: 400 }
      );
    }

    if (amount === 0) {
      return NextResponse.json(
        { error: "Amount cannot be zero" },
        { status: 400 }
      );
    }

    // Get or create user's credit account
    let credit = await prisma.radiumCredit.findUnique({
      where: { userId },
    });

    if (!credit) {
      credit = await prisma.radiumCredit.create({
        data: {
          userId,
          balance: 0,
          lifetime: 0,
        },
      });
    }

    // Calculate new balance
    const newBalance = credit.balance + amount;

    if (newBalance < 0) {
      return NextResponse.json(
        { error: "Insufficient balance for this adjustment" },
        { status: 400 }
      );
    }

    // Update credit balance
    const updatedCredit = await prisma.radiumCredit.update({
      where: { userId },
      data: {
        balance: newBalance,
        lifetime: amount > 0 ? credit.lifetime + amount : credit.lifetime,
      },
    });

    // Create transaction record
    await prisma.radiumTransaction.create({
      data: {
        userId,
        creditId: credit.id,
        type: "ADMIN_ADJUST",
        amount,
        balance: updatedCredit.balance,
        description: `${description}${
          paymentMethod ? ` (${paymentMethod})` : ""
        }`,
      },
    });

    // Create payment record if adding credits
    if (amount > 0) {
      await prisma.payment.create({
        data: {
          userId,
          amount: 0, // Manual adjustment, no actual payment
          currency: "USD",
          status: "SUCCEEDED",
          type: "RADIUM_CREDITS",
          paidAt: new Date(),
          description: `Manual credit adjustment: ${description}`,
          metadata: {
            adjustedBy: session.user.id,
            adjustedByEmail: session.user.email,
            paymentMethod: paymentMethod || "manual",
            creditAmount: amount,
          },
        },
      });
    }

    // Notify user
    await createNotification({
      userId,
      type: "SYSTEM",
      title: amount > 0 ? "Credits Added" : "Credits Adjusted",
      message: `${amount > 0 ? "+" : ""}${amount} credits: ${description}`,
      link: "/profile/credits",
      icon: amount > 0 ? "💰" : "⚙️",
    });

    return NextResponse.json({
      success: true,
      credit: {
        balance: updatedCredit.balance,
        lifetime: updatedCredit.lifetime,
        adjustment: amount,
      },
    });
  } catch (error) {
    console.error("Error adjusting credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/credits/manual-adjust - Get recent manual adjustments
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

    const transactions = await prisma.radiumTransaction.findMany({
      where: {
        type: "ADMIN_ADJUST",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        id: t.id,
        userId: t.userId,
        userName: t.user.name,
        userEmail: t.user.email,
        amount: t.amount,
        balance: t.balance,
        description: t.description,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching manual adjustments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
