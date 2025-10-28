import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { client, paypal } from "@/lib/paypal";
import { createAffiliateCommission } from "@/lib/affiliate-commissions";
import { redirect } from "next/navigation";

// GET /api/paypal/capture-order - Capture a PayPal order after user approval
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return redirect("/auth/signin");
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token"); // PayPal order ID

    if (!token) {
      return redirect("/pricing?error=missing_token");
    }

    // Capture the order
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});

    const capture = await client().execute(request);

    if (capture.result.status !== "COMPLETED") {
      return redirect("/pricing?error=payment_failed");
    }

    // Get custom data from order
    const customId =
      capture.result.purchase_units[0].payments?.captures?.[0]?.custom_id;
    const customData = customId ? JSON.parse(customId) : {};

    // Find the pending payment
    const payment = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        status: "PENDING",
        metadata: {
          path: ["paypalOrderId"],
          equals: token,
        },
      },
    });

    if (!payment) {
      return redirect("/pricing?error=payment_not_found");
    }

    const paymentAmount = parseFloat(
      capture.result.purchase_units[0].amount.value
    );

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCEEDED",
        paidAt: new Date(),
        metadata: {
          ...(payment.metadata as object),
          paypalCaptureId: capture.result.id,
          paypalStatus: capture.result.status,
        },
      },
    });

    // Handle subscription or credits
    if (customData.type === "subscription") {
      // Create or update subscription
      const existingSite = customData.siteId
        ? await prisma.site.findUnique({
            where: { id: customData.siteId },
            include: { subscription: true },
          })
        : null;

      if (existingSite) {
        if (existingSite.subscription) {
          // Update existing subscription
          await prisma.subscription.update({
            where: { id: existingSite.subscription.id },
            data: {
              status: "ACTIVE",
              lastPaymentDate: new Date(),
              lastPaymentAmount: paymentAmount,
            },
          });
        } else {
          // Create new subscription
          const startDate = new Date();
          const endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

          await prisma.subscription.create({
            data: {
              userId: session.user.id,
              siteId: existingSite.id,
              plan: customData.planType || "BASIC",
              status: "ACTIVE",
              amount: paymentAmount,
              monthlyRate: paymentAmount / 12,
              startDate,
              endDate,
              nextBillingDate: endDate,
              lastPaymentDate: new Date(),
              lastPaymentAmount: paymentAmount,
            },
          });

          // Activate the site
          await prisma.site.update({
            where: { id: existingSite.id },
            data: {
              isActive: true,
              status: "ACTIVE",
            },
          });
        }
      }

      // Create affiliate commission if applicable
      await createAffiliateCommission(
        payment.id,
        session.user.id,
        paymentAmount
      );

      return redirect("/profile/sites?success=subscription_activated");
    } else if (customData.type === "credits") {
      // Add credits to user account
      const creditAmount = customData.creditAmount || 0;

      await prisma.radiumCredit.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          balance: creditAmount,
          lifetime: creditAmount,
        },
        update: {
          balance: {
            increment: creditAmount,
          },
          lifetime: {
            increment: creditAmount,
          },
        },
      });

      // Create transaction record
      const credit = await prisma.radiumCredit.findUnique({
        where: { userId: session.user.id },
      });

      if (credit) {
        await prisma.radiumTransaction.create({
          data: {
            userId: session.user.id,
            creditId: credit.id,
            type: "PURCHASE",
            amount: creditAmount,
            balance: credit.balance,
            cost: paymentAmount,
            currency: "USD",
            description: `Purchased ${creditAmount} credits via PayPal`,
          },
        });
      }

      return redirect("/profile/credits?success=credits_added");
    }

    return redirect("/profile?success=payment_completed");
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return redirect("/pricing?error=capture_failed");
  }
}
