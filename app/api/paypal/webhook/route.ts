import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createAffiliateCommission,
  cancelCommission,
} from "@/lib/affiliate-commissions";

// POST /api/paypal/webhook - Handle PayPal webhook events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    console.log("PayPal webhook received:", eventType);

    // Handle payment capture completed
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = body.resource;
      const customId = resource.custom_id;

      if (!customId) {
        return NextResponse.json({ received: true });
      }

      const customData = JSON.parse(customId);

      // Find the pending payment
      const payment = await prisma.payment.findFirst({
        where: {
          userId: customData.userId,
          status: "PENDING",
          metadata: {
            path: ["paypalOrderId"],
            equals: resource.supplementary_data?.related_ids?.order_id,
          },
        },
      });

      if (payment) {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCEEDED",
            paidAt: new Date(),
          },
        });

        // Create affiliate commission
        await createAffiliateCommission(
          payment.id,
          customData.userId,
          payment.amount
        );
      }
    }

    // Handle payment capture refunded
    if (eventType === "PAYMENT.CAPTURE.REFUNDED") {
      const resource = body.resource;
      const captureId = resource.id;

      // Find the payment
      const payment = await prisma.payment.findFirst({
        where: {
          metadata: {
            path: ["paypalCaptureId"],
            equals: captureId,
          },
        },
        include: {
          affiliateCommissions: true,
        },
      });

      if (payment) {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "REFUNDED" },
        });

        // Cancel any pending commissions
        for (const commission of payment.affiliateCommissions) {
          if (commission.status === "PENDING") {
            await cancelCommission(
              commission.id,
              "Payment was refunded via PayPal"
            );
          }
        }

        // If this was a credit purchase, deduct the credits
        if (payment.type === "RADIUM_CREDITS") {
          const metadata = payment.metadata as any;
          const creditAmount = metadata?.creditAmount || 0;

          if (creditAmount > 0) {
            const credit = await prisma.radiumCredit.findUnique({
              where: { userId: payment.userId },
            });

            if (credit && credit.balance >= creditAmount) {
              await prisma.radiumCredit.update({
                where: { userId: payment.userId },
                data: {
                  balance: {
                    decrement: creditAmount,
                  },
                },
              });

              await prisma.radiumTransaction.create({
                data: {
                  userId: payment.userId,
                  creditId: credit.id,
                  type: "REFUND",
                  amount: -creditAmount,
                  balance: credit.balance - creditAmount,
                  description: "Credits refunded due to PayPal refund",
                },
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing PayPal webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
