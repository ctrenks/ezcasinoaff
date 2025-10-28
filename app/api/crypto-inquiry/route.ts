import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/crypto-inquiry - Send crypto payment inquiry
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      purchaseType,
      itemName,
      amount,
      creditAmount,
      preferredCrypto,
      message,
    } = body;

    // Validate required fields
    if (!purchaseType || !itemName || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build email content
    const emailContent = `
New Cryptocurrency Payment Inquiry

═══════════════════════════════════════
USER INFORMATION
═══════════════════════════════════════
Name: ${session.user.name || "Not provided"}
Email: ${session.user.email}
User ID: ${session.user.id}

═══════════════════════════════════════
PURCHASE DETAILS
═══════════════════════════════════════
Type: ${purchaseType === "subscription" ? "Subscription" : "Credits"}
Item: ${itemName}
Amount: $${amount} USD
${creditAmount ? `Credits: ${creditAmount.toLocaleString()}` : ""}

═══════════════════════════════════════
PAYMENT PREFERENCE
═══════════════════════════════════════
Preferred Cryptocurrency: ${preferredCrypto || "Not specified"}

═══════════════════════════════════════
ADDITIONAL MESSAGE
═══════════════════════════════════════
${message || "No additional message"}

═══════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════
1. Reply to this email with your wallet address for ${
      preferredCrypto || "BTC/ETH/USDT"
    }
2. Wait for user to send payment
3. Verify transaction on blockchain
4. Log into /admin/credits and credit the user's account
5. User will receive automatic notification

---
This inquiry was sent from the EZ Casino Affiliates platform.
User's direct reply-to email: ${session.user.email}
    `.trim();

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "EZ Casino Affiliates <noreply@ezcasinoaff.com>",
      to: "support@ezcasinoaff.com",
      replyTo: session.user.email || undefined,
      subject: `Crypto Payment: ${itemName} - $${amount} (${session.user.email})`,
      text: emailContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send inquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("Error sending crypto inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
