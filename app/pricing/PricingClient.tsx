"use client";

import { useState } from "react";
import PayPalButton from "@/components/PayPalButton";

interface PricingClientProps {
  type: "subscription" | "credits";
  amount: number;
  planType?: string;
  planName?: string;
  creditAmount?: number;
  packName?: string;
}

export default function PricingClient({
  type,
  amount,
  planType,
  planName,
  creditAmount,
  packName,
}: PricingClientProps) {
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  const handleCryptoClick = () => {
    setShowCryptoModal(true);
  };

  return (
    <>
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 text-center mb-2">
          Choose your payment method:
        </p>

        {/* PayPal Button */}
        <PayPalButton
          type={type}
          amount={amount}
          planType={planType}
          creditAmount={creditAmount}
          onSuccess={() => {
            if (type === "subscription") {
              window.location.href =
                "/profile/sites?success=subscription_activated";
            } else {
              window.location.href = "/profile/credits?success=credits_added";
            }
          }}
        />

        {/* Crypto Button */}
        <button
          onClick={handleCryptoClick}
          className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold border border-gray-300"
        >
          💰 Pay with Crypto
        </button>
      </div>

      {/* Crypto Payment Modal */}
      {showCryptoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCryptoModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Cryptocurrency Payment</h3>
            <p className="text-gray-600 mb-4">
              To purchase{" "}
              <strong>
                {type === "subscription"
                  ? `${planName} subscription`
                  : `${creditAmount?.toLocaleString()} credits (${packName})`}
              </strong>{" "}
              for <strong>${amount}</strong> using cryptocurrency:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-6 text-sm text-gray-700">
              <li>
                Contact us at{" "}
                <strong className="text-purple-600">
                  admin@yourdomain.com
                </strong>
              </li>
              <li>
                Specify what you want to purchase (plan/credits and amount)
              </li>
              <li>We&apos;ll provide wallet addresses for BTC, ETH, or USDT</li>
              <li>Send payment to the provided address</li>
              <li>Reply with your transaction hash</li>
              <li>
                {type === "subscription"
                  ? "Subscription will be activated"
                  : "Credits will be added"}{" "}
                within 1 hour of confirmation
              </li>
            </ol>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Quick Tip:</strong> Include your account email in
                your message for faster processing!
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:admin@yourdomain.com?subject=Crypto Payment: ${
                  type === "subscription" ? planName : packName
                } - $${amount}&body=Hi, I'd like to purchase ${
                  type === "subscription"
                    ? `the ${planName} subscription`
                    : `${creditAmount} credits (${packName})`
                } for $${amount} using cryptocurrency.%0D%0A%0D%0AMy account email: [Your Email]%0D%0APreferred crypto: [BTC/ETH/USDT]%0D%0A%0D%0AThank you!`}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center font-semibold"
              >
                📧 Email Us
              </a>
              <button
                onClick={() => setShowCryptoModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
