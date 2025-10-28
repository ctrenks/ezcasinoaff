"use client";

import { useState } from "react";

interface PayPalButtonProps {
  type: "subscription" | "credits";
  amount: number;
  planType?: string;
  creditAmount?: number;
  siteId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PayPalButton({
  type,
  amount,
  planType,
  creditAmount,
  siteId,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayPalPayment = async () => {
    setLoading(true);

    try {
      // Create PayPal order
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount,
          planType,
          creditAmount,
          siteId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create PayPal order");
      }

      const data = await response.json();

      // Redirect to PayPal approval
      const approveUrl = `https://www.${
        process.env.NEXT_PUBLIC_PAYPAL_MODE === "live" ? "" : "sandbox."
      }paypal.com/checkoutnow?token=${data.orderId}`;

      window.location.href = approveUrl;
    } catch (error) {
      console.error("PayPal payment error:", error);
      if (onError) {
        onError("Failed to initiate PayPal payment");
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayPalPayment}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0070BA] text-white rounded-lg hover:bg-[#005EA6] transition disabled:opacity-50 font-semibold"
    >
      {loading ? (
        <span>Processing...</span>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .761-.629h8.132c2.843 0 4.746 1.474 4.815 4.036.03 1.124-.244 2.006-.744 2.657-.589.765-1.517 1.233-2.678 1.409.406.125.76.29 1.059.495 1.036.71 1.534 1.922 1.484 3.604-.085 2.94-2.275 4.885-5.538 4.885h-5.16z" />
          </svg>
          <span>Pay with PayPal</span>
        </>
      )}
    </button>
  );
}
