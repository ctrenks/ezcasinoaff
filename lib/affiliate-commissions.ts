import prisma from "./prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { createNotification } from "./notifications";

/**
 * Calculate and create an affiliate commission for a payment
 * This should be called when a payment is successfully processed
 */
export async function createAffiliateCommission(
  paymentId: string,
  userId: string,
  paymentAmount: Decimal | number,
  subscriptionId?: string
) {
  try {
    // Get the user who made the payment
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        referredById: true,
        referredBy: {
          select: {
            id: true,
            commissionRate: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // If user was not referred by anyone, no commission to create
    if (!user?.referredById || !user.referredBy) {
      return null;
    }

    const referrer = user.referredBy;
    const commissionRate = Number(referrer.commissionRate);
    const amount =
      typeof paymentAmount === "number" ? paymentAmount : Number(paymentAmount);

    // Calculate commission amount
    const commissionAmount = (amount * commissionRate) / 100;

    // Create the commission record
    const commission = await prisma.affiliateCommission.create({
      data: {
        referrerId: referrer.id,
        referredUserId: userId,
        paymentId,
        subscriptionId,
        amount: commissionAmount,
        percentage: commissionRate,
        paymentAmount: amount,
        currency: "USD", // Default to USD, could be passed as parameter
        status: "PENDING",
      },
    });

    // Create a notification for the referrer
    await createNotification({
      userId: referrer.id,
      type: "AFFILIATE_EARNING",
      title: "New Affiliate Commission",
      message: `You earned $${commissionAmount.toFixed(
        2
      )} (${commissionRate}%) from a referral payment`,
      link: "/profile/affiliates",
      icon: "💰",
      metadata: {
        commissionId: commission.id,
        amount: commissionAmount,
        percentage: commissionRate,
      },
    });

    console.log(
      `Created affiliate commission: $${commissionAmount.toFixed(
        2
      )} for referrer ${referrer.id}`
    );

    return commission;
  } catch (error) {
    console.error("Error creating affiliate commission:", error);
    // Don't throw error - we don't want to fail the payment if commission creation fails
    return null;
  }
}

/**
 * Mark a commission as paid
 */
export async function markCommissionAsPaid(commissionId: string) {
  try {
    const commission = await prisma.affiliateCommission.update({
      where: { id: commissionId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
      include: {
        referrer: {
          select: { id: true, name: true },
        },
      },
    });

    // Create notification
    await createNotification({
      userId: commission.referrerId,
      type: "SYSTEM",
      title: "Commission Paid",
      message: `Your commission of $${Number(commission.amount).toFixed(
        2
      )} has been paid`,
      link: "/profile/affiliates",
      icon: "✅",
    });

    return commission;
  } catch (error) {
    console.error("Error marking commission as paid:", error);
    throw error;
  }
}

/**
 * Cancel a commission (e.g., due to refund or fraud)
 */
export async function cancelCommission(commissionId: string, reason: string) {
  try {
    const commission = await prisma.affiliateCommission.update({
      where: { id: commissionId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
      include: {
        referrer: {
          select: { id: true, name: true },
        },
      },
    });

    // Create notification
    await createNotification({
      userId: commission.referrerId,
      type: "SYSTEM",
      title: "Commission Cancelled",
      message: `A commission of $${Number(commission.amount).toFixed(
        2
      )} was cancelled: ${reason}`,
      link: "/profile/affiliates",
      icon: "❌",
    });

    return commission;
  } catch (error) {
    console.error("Error cancelling commission:", error);
    throw error;
  }
}

/**
 * Get commission stats for a user
 */
export async function getUserCommissionStats(userId: string) {
  try {
    const [totalEarned, pendingEarnings, paidEarnings, totalReferrals] =
      await Promise.all([
        // Total earned (all statuses except cancelled)
        prisma.affiliateCommission.aggregate({
          where: {
            referrerId: userId,
            status: { not: "CANCELLED" },
          },
          _sum: { amount: true },
        }),
        // Pending earnings
        prisma.affiliateCommission.aggregate({
          where: {
            referrerId: userId,
            status: "PENDING",
          },
          _sum: { amount: true },
        }),
        // Paid earnings
        prisma.affiliateCommission.aggregate({
          where: {
            referrerId: userId,
            status: "PAID",
          },
          _sum: { amount: true },
        }),
        // Total referrals
        prisma.user.count({
          where: { referredById: userId },
        }),
      ]);

    return {
      totalEarned: Number(totalEarned._sum.amount || 0),
      pendingEarnings: Number(pendingEarnings._sum.amount || 0),
      paidEarnings: Number(paidEarnings._sum.amount || 0),
      totalReferrals,
    };
  } catch (error) {
    console.error("Error getting commission stats:", error);
    throw error;
  }
}
