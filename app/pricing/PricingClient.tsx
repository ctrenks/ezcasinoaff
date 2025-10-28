"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [preferredCrypto, setPreferredCrypto] = useState("BTC");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [payingWithCredits, setPayingWithCredits] = useState(false);

  // Fetch user's credit balance
  useEffect(() => {
    if (session?.user) {
      fetch("/api/ez-credits")
        .then((res) => res.json())
        .then((data) => setUserCredits(data.balance || 0))
        .catch(() => setUserCredits(0));
    }
  }, [session]);

  const requiredCredits = Math.ceil(amount);
  const hasEnoughCredits =
    userCredits !== null && userCredits >= requiredCredits;

  const handleCryptoClick = () => {
    setShowCryptoModal(true);
    setSubmitMessage(null);
    setMessage("");
    setPreferredCrypto("BTC");
  };

  const handlePayWithCredits = async () => {
    if (!hasEnoughCredits || payingWithCredits) return;

    const confirmed = confirm(
      `Pay with ${requiredCredits} Radium Credits?\n\nThis will deduct ${requiredCredits} credits from your balance.`
    );

    if (!confirmed) return;

    setPayingWithCredits(true);

    try {
      const response = await fetch("/api/credits/pay-with-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount,
          planType,
          creditAmount,
        }),
      });

      if (response.ok) {
        if (type === "subscription") {
          window.location.href =
            "/profile/sites?success=subscription_activated";
        } else {
          window.location.href = "/profile/credits?success=credits_added";
        }
      } else {
        const data = await response.json();
        alert(`Payment failed: ${data.error || "Unknown error"}`);
        setPayingWithCredits(false);
      }
    } catch (error) {
      console.error("Error paying with credits:", error);
      alert("An error occurred. Please try again.");
      setPayingWithCredits(false);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/crypto-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseType: type,
          itemName: type === "subscription" ? planName : packName,
          amount,
          creditAmount: type === "credits" ? creditAmount : undefined,
          preferredCrypto,
          message,
        }),
      });

      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: "Your inquiry has been sent! We'll reply with payment instructions within a few hours.",
        });
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setShowCryptoModal(false);
          setSubmitMessage(null);
        }, 3000);
      } else {
        setSubmitMessage({
          type: "error",
          text: "Failed to send inquiry. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setSending(false);
    }
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

        {/* Pay with Credits Button */}
        {hasEnoughCredits && (
          <button
            onClick={handlePayWithCredits}
            disabled={payingWithCredits}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {payingWithCredits ? (
              "Processing..."
            ) : (
              <>💎 Pay with {requiredCredits} Credits</>
            )}
          </button>
        )}

        {/* Show credit balance if logged in */}
        {session?.user && userCredits !== null && (
          <div className="text-center text-sm">
            <span className="text-gray-600">
              Your Balance: <strong>{userCredits.toLocaleString()}</strong>{" "}
              credits
            </span>
            {!hasEnoughCredits && requiredCredits > 0 && (
              <p className="text-red-600 text-xs mt-1">
                Need {(requiredCredits - userCredits).toLocaleString()} more
                credits
              </p>
            )}
          </div>
        )}

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
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              💰 Cryptocurrency Payment Inquiry
            </h3>

            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              {/* Purchase Details */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">
                  Purchase Details
                </h4>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>
                    <strong>Item:</strong>{" "}
                    {type === "subscription" ? planName : packName}
                  </p>
                  {type === "credits" && (
                    <p>
                      <strong>Credits:</strong> {creditAmount?.toLocaleString()}
                    </p>
                  )}
                  <p>
                    <strong>Amount:</strong> ${amount} USD
                  </p>
                </div>
              </div>

              {/* Account Info (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Account Email
                </label>
                <input
                  type="text"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {session?.user?.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={session.user.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              )}

              {/* Preferred Crypto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Cryptocurrency{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredCrypto}
                  onChange={(e) => setPreferredCrypto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="Other">Other (specify in message)</option>
                </select>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any additional information or questions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>⚡ What happens next:</strong>
                  <br />
                  We&apos;ll email you wallet address and payment instructions
                  within a few hours. After we confirm your payment on the
                  blockchain, your{" "}
                  {type === "subscription" ? "subscription" : "credits"} will be
                  activated immediately.
                </p>
              </div>

              {/* Success/Error Message */}
              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "📤 Send Inquiry"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCryptoModal(false)}
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
