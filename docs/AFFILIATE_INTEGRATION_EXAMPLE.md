# Affiliate Commission Integration Example

## Integrating Commission Tracking with Payment Processing

This guide shows how to integrate the affiliate commission system with your payment processing flow.

## Example: Stripe Webhook Integration

Here's an example of how to integrate commission tracking into your Stripe payment webhook:

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { createAffiliateCommission } from "@/lib/affiliate-commissions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle successful payment
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      // Update payment record in database
      const payment = await prisma.payment.update({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: {
          status: "SUCCEEDED",
          paidAt: new Date(),
        },
      });

      // ✅ CREATE AFFILIATE COMMISSION
      // This automatically checks if the user was referred and creates a commission
      await createAffiliateCommission(
        payment.id,
        payment.userId,
        payment.amount,
        payment.subscriptionId || undefined
      );

      console.log("Payment processed and commission created:", payment.id);
    } catch (error) {
      console.error("Error processing payment:", error);
      // Don't return error - we still processed the payment
    }
  }

  // Handle subscription created/updated
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;

    try {
      // Find subscription
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: invoice.subscription as string },
      });

      if (subscription) {
        // Create payment record
        const payment = await prisma.payment.create({
          data: {
            userId: subscription.userId,
            subscriptionId: subscription.id,
            amount: invoice.amount_paid / 100, // Convert from cents
            currency: invoice.currency.toUpperCase(),
            status: "SUCCEEDED",
            type: "SUBSCRIPTION",
            stripeInvoiceId: invoice.id,
            paidAt: new Date(),
          },
        });

        // ✅ CREATE AFFILIATE COMMISSION
        await createAffiliateCommission(
          payment.id,
          subscription.userId,
          payment.amount,
          subscription.id
        );

        // Update subscription last payment info
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            lastPaymentDate: new Date(),
            lastPaymentAmount: payment.amount,
          },
        });

        console.log("Subscription payment processed and commission created");
      }
    } catch (error) {
      console.error("Error processing subscription payment:", error);
    }
  }

  // Handle refunds - cancel the commission
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    try {
      // Find the payment
      const payment = await prisma.payment.findFirst({
        where: {
          stripePaymentIntentId: charge.payment_intent as string,
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

        // ✅ CANCEL ANY COMMISSIONS
        for (const commission of payment.affiliateCommissions) {
          if (commission.status === "PENDING") {
            await cancelCommission(commission.id, "Payment was refunded");
          }
        }

        console.log("Payment refunded and commissions cancelled");
      }
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  }

  return NextResponse.json({ received: true });
}
```

## Example: Manual Payment Processing

If you're processing payments manually or through a different provider:

```typescript
// After successful payment
async function processPayment(userId: string, amount: number) {
  // 1. Create payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      amount,
      currency: "USD",
      status: "SUCCEEDED",
      type: "SUBSCRIPTION",
      paidAt: new Date(),
    },
  });

  // 2. Create affiliate commission (if applicable)
  await createAffiliateCommission(payment.id, userId, amount);

  // 3. Process the rest of your payment logic
  // ...

  return payment;
}
```

## Example: Admin Manual Payout

Create an admin endpoint to mark commissions as paid:

```typescript
// app/api/admin/affiliates/payout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { markCommissionAsPaid } from "@/lib/affiliate-commissions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if user is super admin
  if (!session?.user || session.user.role !== 0) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { commissionId } = await req.json();

  try {
    const commission = await markCommissionAsPaid(commissionId);

    return NextResponse.json({
      success: true,
      commission,
    });
  } catch (error) {
    console.error("Error marking commission as paid:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  }
}
```

## Commission Calculation Examples

### Example 1: User with 15% commission rate

- Payment: $100
- Commission: $15 (15%)
- Status: PENDING

### Example 2: User with custom 20% commission rate

- Payment: $500
- Commission: $100 (20%)
- Status: PENDING

### Example 3: User not referred by anyone

- Payment: $100
- Commission: None created (user has no referrer)

## Testing Checklist

- [ ] User A creates referral link
- [ ] User B signs up using User A's link
- [ ] User B makes payment
- [ ] Commission is created for User A
- [ ] User A sees commission in dashboard
- [ ] User A receives notification
- [ ] Admin can see commission in admin panel
- [ ] Admin can update User A's commission rate
- [ ] Future payments from User B use updated rate
- [ ] Refunded payments cancel commissions
- [ ] Admin can mark commissions as paid

## Common Issues

### Commission not being created

1. Check that `createAffiliateCommission` is called in your payment handler
2. Verify the user has a referrer (`referredById` is set)
3. Check server logs for errors
4. Ensure payment status is 'SUCCEEDED'

### Wrong commission amount

1. Verify the user's `commissionRate` field
2. Check that the payment amount is correct
3. Review the calculation in `lib/affiliate-commissions.ts`

### Notifications not being sent

1. Ensure notification system is configured
2. Check that `createNotification` function is working
3. Verify user has not disabled notifications

## Best Practices

1. **Always call commission creation AFTER payment is confirmed**

   - Wait for payment provider confirmation
   - Don't create commissions for pending/failed payments

2. **Handle errors gracefully**

   - Commission creation should not block payment processing
   - Log errors but continue with payment flow

3. **Track everything**

   - Keep detailed logs of commission creation
   - Store metadata about payments and commissions
   - Maintain audit trail

4. **Prevent fraud**

   - Monitor for suspicious referral patterns
   - Flag users with unusually high referral rates
   - Review commissions before payout

5. **Clear communication**
   - Set clear terms for commission payouts
   - Notify users when commissions are earned
   - Notify users when commissions are paid

## Support

If you encounter issues:

1. Check the documentation in `docs/AFFILIATE_PROGRAM.md`
2. Review the implementation in `lib/affiliate-commissions.ts`
3. Check server logs for detailed error messages
4. Test in development environment first
