import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAffiliateCommission } from "@/lib/affiliate-commissions";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

// POST /api/credits/pay-with-credits - Pay for subscription or credits using Radium credits
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, amount, planType, creditAmount, siteId } = body;

    // Validate required fields
    if (!type || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type === "subscription" && !planType) {
      return NextResponse.json(
        { error: "Plan type required for subscription" },
        { status: 400 }
      );
    }

    if (type === "credits" && !creditAmount) {
      return NextResponse.json(
        { error: "Credit amount required for credit purchase" },
        { status: 400 }
      );
    }

    // Calculate required credits (1:1 ratio)
    const requiredCredits = Math.ceil(amount);

    // Get user's current User Credit balance (EZ Credits)
    const userCredit = await prisma.userCredit.findUnique({
      where: { userId: session.user.id },
    });

    if (!userCredit || userCredit.balance < requiredCredits) {
      return NextResponse.json(
        {
          error: "Insufficient User Credits (EZ Credits)",
          required: requiredCredits,
          available: userCredit?.balance || 0,
        },
        { status: 400 }
      );
    }

    // Process payment based on type
    if (type === "subscription") {
      // Validate siteId for subscription
      if (!siteId) {
        return NextResponse.json(
          { error: "Site ID required for subscription" },
          { status: 400 }
        );
      }

      // Verify site ownership
      const site = await prisma.site.findFirst({
        where: {
          id: siteId,
          userId: session.user.id,
        },
      });

      if (!site) {
        return NextResponse.json(
          { error: "Site not found or access denied" },
          { status: 404 }
        );
      }

      // Check if site already has an active subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          siteId: site.id,
          status: "ACTIVE",
        },
      });

      if (existingSubscription) {
        return NextResponse.json(
          { error: "Site already has an active subscription" },
          { status: 400 }
        );
      }

      // Create transaction
      const result = await prisma.$transaction(async (tx) => {
        // Deduct User Credits (EZ Credits)
        const updatedCredit = await tx.userCredit.update({
          where: { userId: session.user.id },
          data: {
            balance: {
              decrement: requiredCredits,
            },
          },
        });

        // Create payment record
        const payment = await tx.payment.create({
          data: {
            userId: session.user.id,
            siteId: site.id,
            amount: amount,
            currency: "USD",
            status: "SUCCEEDED",
            type: "SUBSCRIPTION",
            description: `${planType} Subscription - Paid with Credits`,
            paidAt: new Date(),
          },
        });

        // Calculate subscription dates (1 year)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        const monthlyRate = amount / 12;

        // Get plan details for feature flags and credits
        const planKey = planType as keyof typeof SUBSCRIPTION_PLANS;
        const plan = SUBSCRIPTION_PLANS[planKey];
        const annualRadiumCredits = plan.features.includedCredits * 12; // Award full year upfront

        // Create subscription
        const subscription = await tx.subscription.create({
          data: {
            userId: session.user.id,
            siteId: site.id,
            plan: planType,
            status: "ACTIVE",
            amount: amount,
            monthlyRate: monthlyRate,
            currency: "USD",
            billingPeriod: "YEARLY",
            startDate: startDate,
            endDate: endDate,
            nextBillingDate: endDate,
            lastPaymentDate: new Date(),
            lastPaymentAmount: amount,
            autoRenew: true,
          },
        });

        // Update site and set feature flags based on plan
        await tx.site.update({
          where: { id: site.id },
          data: {
            subscriptionId: subscription.id,
            isActive: true,
            status: "ACTIVE",
            hasGameScreenshots: plan.features.gameScreenshots,
            hasBonusCodeFeed: plan.features.bonusCodeFeed,
          },
        });

        // Create User Credit transaction record
        await tx.userCreditTransaction.create({
          data: {
            userId: session.user.id,
            creditId: userCredit.id,
            type: "USAGE",
            amount: -requiredCredits,
            balance: updatedCredit.balance,
            description: `Subscription payment: ${planType} plan`,
          },
        });

        // Award annual Radium credits for the subscription

        const radiumCredit = await tx.radiumCredit.upsert({
          where: { userId: session.user.id },
          create: {
            userId: session.user.id,
            balance: annualRadiumCredits,
            lifetime: annualRadiumCredits,
          },
          update: {
            balance: {
              increment: annualRadiumCredits,
            },
            lifetime: {
              increment: annualRadiumCredits,
            },
          },
        });

        // Create Radium transaction record
        await tx.radiumTransaction.create({
          data: {
            userId: session.user.id,
            creditId: radiumCredit.id,
            type: "SUBSCRIPTION",
            amount: annualRadiumCredits,
            balance: radiumCredit.balance,
            description: `Annual Radium Credits for ${planType} subscription (${site.name})`,
          },
        });

        // Create affiliate commission if user was referred
        const user = await tx.user.findUnique({
          where: { id: session.user.id },
          select: { referredById: true },
        });

        if (user?.referredById) {
          await createAffiliateCommission(
            payment.id,
            session.user.id,
            amount,
            subscription.id
          );
        }

        // Send notification
        await tx.notification.create({
          data: {
            userId: session.user.id,
            type: "SUBSCRIPTION",
            title: "Subscription Activated",
            message: `Your ${planType} subscription has been activated using ${requiredCredits} credits.`,
            link: `/profile/sites/${site.id}`,
            icon: "✅",
          },
        });

        return {
          payment,
          subscription,
          creditsUsed: requiredCredits,
          annualRadiumCredits,
          creditBalance: updatedCredit.balance,
        };
      });

      // Send notification to user
      await createNotification({
        userId: session.user.id,
        type: "SYSTEM",
        title: "Subscription Activated! 🎉",
        message: `Your ${planType} subscription for ${site.name} is now active. You received ${result.annualRadiumCredits} Radium Credits!`,
        link: "/profile/credits",
        icon: "🤖",
      });

      return NextResponse.json({
        success: true,
        ...result,
      });
    } else if (type === "credits") {
      // Purchase User Credits with User Credits (basically a conversion/bonus scenario)
      const result = await prisma.$transaction(async (tx) => {
        // Deduct payment credits
        const updatedCredit = await tx.userCredit.update({
          where: { userId: session.user.id },
          data: {
            balance: {
              decrement: requiredCredits,
            },
          },
        });

        // Create deduction transaction
        await tx.userCreditTransaction.create({
          data: {
            userId: session.user.id,
            creditId: userCredit.id,
            type: "USAGE",
            amount: -requiredCredits,
            balance: updatedCredit.balance,
            description: `User Credit pack purchase payment`,
          },
        });

        // Add purchased User Credits
        const finalCredit = await tx.userCredit.update({
          where: { userId: session.user.id },
          data: {
            balance: {
              increment: creditAmount,
            },
            lifetime: {
              increment: creditAmount,
            },
          },
        });

        // Create purchase transaction
        await tx.userCreditTransaction.create({
          data: {
            userId: session.user.id,
            creditId: userCredit.id,
            type: "PURCHASE",
            amount: creditAmount,
            balance: finalCredit.balance,
            cost: amount,
            currency: "USD",
            description: `User Credit pack purchase: ${creditAmount} credits`,
          },
        });

        // Create payment record
        const payment = await tx.payment.create({
          data: {
            userId: session.user.id,
            amount: amount,
            currency: "USD",
            status: "SUCCEEDED",
            type: "USER_CREDITS",
            description: `${creditAmount} User Credits (EZ Credits) - Paid with Credits`,
            paidAt: new Date(),
          },
        });

        // Create affiliate commission if user was referred
        const user = await tx.user.findUnique({
          where: { id: session.user.id },
          select: { referredById: true },
        });

        if (user?.referredById) {
          await createAffiliateCommission(payment.id, session.user.id, amount);
        }

        // Send notification
        await tx.notification.create({
          data: {
            userId: session.user.id,
            type: "SUBSCRIPTION",
            title: "Credits Added",
            message: `${creditAmount} credits have been added to your account using ${requiredCredits} credits.`,
            link: "/profile/credits",
            icon: "💎",
          },
        });

        return {
          payment,
          creditsUsed: requiredCredits,
          creditsAdded: creditAmount,
          newBalance: finalCredit.balance,
        };
      });

      return NextResponse.json({
        success: true,
        ...result,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing credit payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
