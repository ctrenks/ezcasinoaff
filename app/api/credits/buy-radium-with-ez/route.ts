import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { radiumAmount, ezCreditCost, packName } = await req.json();

    if (
      !radiumAmount ||
      !ezCreditCost ||
      typeof radiumAmount !== "number" ||
      typeof ezCreditCost !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get user's EZ Credit balance
    const userCredit = await prisma.userCredit.findUnique({
      where: { userId: session.user.id },
    });

    if (!userCredit || userCredit.balance < ezCreditCost) {
      return NextResponse.json(
        {
          error: "Insufficient EZ Credits",
          required: ezCreditCost,
          available: userCredit?.balance || 0,
        },
        { status: 400 }
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Deduct EZ Credits
      const updatedEzCredit = await tx.userCredit.update({
        where: { userId: session.user.id },
        data: {
          balance: {
            decrement: ezCreditCost,
          },
        },
      });

      // Create EZ Credit transaction record
      await tx.userCreditTransaction.create({
        data: {
          userId: session.user.id,
          creditId: userCredit.id,
          type: "USAGE",
          amount: -ezCreditCost,
          balance: updatedEzCredit.balance,
          description: `Purchased ${radiumAmount} Radium Credits (${packName})`,
        },
      });

      // Add Radium Credits
      const radiumCredit = await tx.radiumCredit.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          balance: radiumAmount,
          lifetime: radiumAmount,
        },
        update: {
          balance: {
            increment: radiumAmount,
          },
          lifetime: {
            increment: radiumAmount,
          },
        },
      });

      // Create Radium Credit transaction record
      await tx.radiumTransaction.create({
        data: {
          userId: session.user.id,
          creditId: radiumCredit.id,
          type: "PURCHASE",
          amount: radiumAmount,
          balance: radiumCredit.balance,
          cost: ezCreditCost,
          currency: "EZ_CREDITS",
          description: `Purchased ${radiumAmount} Radium Credits with EZ Credits (${packName})`,
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          userId: session.user.id,
          amount: ezCreditCost,
          currency: "EZ_CREDITS",
          status: "SUCCEEDED",
          type: "RADIUM_CREDITS",
          paidAt: new Date(),
          description: `Radium Credits purchase: ${packName}`,
          metadata: {
            radiumAmount,
            ezCreditCost,
            packName,
          },
        },
      });

      return {
        ezCreditBalance: updatedEzCredit.balance,
        radiumBalance: radiumCredit.balance,
      };
    });

    // Send notification
    await createNotification({
      userId: session.user.id,
      type: "SYSTEM",
      title: "Radium Credits Purchased! 🤖",
      message: `You've purchased ${radiumAmount} Radium Credits for ${ezCreditCost} EZ Credits (${packName}).`,
      link: "/profile/credits",
      icon: "🤖",
    });

    return NextResponse.json({
      success: true,
      ezCreditBalance: result.ezCreditBalance,
      radiumBalance: result.radiumBalance,
      radiumAdded: radiumAmount,
    });
  } catch (error) {
    console.error("Error buying Radium Credits with EZ Credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
