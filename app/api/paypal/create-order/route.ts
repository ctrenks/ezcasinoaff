import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { client, paypal } from "@/lib/paypal";

// POST /api/paypal/create-order - Create a PayPal order for subscription or credits
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, amount, planType, creditAmount, siteId } = body;

    // Validate request
    if (!type || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type === "subscription" && !planType) {
      return NextResponse.json(
        { error: "Plan type required for subscriptions" },
        { status: 400 }
      );
    }

    if (type === "credits" && !creditAmount) {
      return NextResponse.json(
        { error: "Credit amount required for credit purchases" },
        { status: 400 }
      );
    }

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
          description:
            type === "subscription"
              ? `${planType} Subscription Plan`
              : `${creditAmount} Radium Credits`,
          custom_id: JSON.stringify({
            userId: session.user.id,
            type,
            planType,
            creditAmount,
            siteId,
          }),
        },
      ],
      application_context: {
        brand_name: "EZ Casino Affiliates",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXTAUTH_URL}/api/paypal/capture-order`,
        cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      },
    });

    const order = await client().execute(request);

    // Store pending payment in database
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        siteId: siteId || null,
        amount: parseFloat(amount),
        currency: "USD",
        status: "PENDING",
        type: type === "subscription" ? "SUBSCRIPTION" : "RADIUM_CREDITS",
        description:
          type === "subscription"
            ? `${planType} Subscription`
            : `${creditAmount} Radium Credits`,
        metadata: {
          paypalOrderId: order.result.id,
          planType,
          creditAmount,
        },
      },
    });

    return NextResponse.json({
      orderId: order.result.id,
      status: order.result.status,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
