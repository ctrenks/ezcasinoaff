"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CREDIT_PACKS } from "@/lib/pricing";
import PayPalButton from "@/components/PayPalButton";

interface CreditData {
  balance: number;
  lifetime: number;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    balance: number;
    description: string | null;
    createdAt: string;
    site: {
      name: string | null;
      domain: string;
    } | null;
  }>;
}

export default function CreditsDisplay() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [preferredCrypto, setPreferredCrypto] = useState("BTC");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits");
      if (response.ok) {
        const data = await response.json();
        setCredits(data);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    } finally {
      setLoading(false);
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
          purchaseType: "radium", // Radium Credits (AI review generation)
          itemName: selectedPack.name,
          amount: selectedPack.price,
          creditAmount: selectedPack.totalCredits,
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
          setSelectedPack(null);
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "💰";
      case "USAGE":
        return "📊";
      case "REFUND":
        return "↩️";
      case "BONUS":
        return "🎁";
      case "ADMIN_ADJUST":
        return "⚙️";
      default:
        return "📝";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "PURCHASE":
      case "BONUS":
      case "REFUND":
        return "text-green-600";
      case "USAGE":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">
              Radium Credits (AI Reviews)
            </p>
            <p className="text-5xl font-bold">
              {credits?.balance.toLocaleString() || 0}
            </p>
            <p className="text-indigo-200 text-sm mt-2">
              Lifetime: {credits?.lifetime.toLocaleString() || 0} credits
            </p>
            <p className="text-indigo-100 text-xs mt-1">
              🤖 ~$3-4 per credit · Generates AI reviews
            </p>
          </div>
          <div className="text-6xl">🤖</div>
        </div>
      </div>

      {/* Purchase Packs */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Purchase Radium Credits
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Generate professional AI-powered casino and game reviews. Each credit
          generates one complete review.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(CREDIT_PACKS).map((pack) => (
            <div
              key={pack.id}
              className={`border-2 rounded-lg p-6 hover:shadow-lg transition ${
                "popular" in pack && pack.popular
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              {"popular" in pack && pack.popular && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-600 text-white rounded-full mb-2">
                  Most Popular
                </span>
              )}
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {pack.name}
              </h3>
              <div className="mb-4">
                <p className="text-3xl font-bold text-purple-600">
                  ${pack.price}
                </p>
                <p className="text-sm text-gray-600">
                  {pack.totalCredits.toLocaleString()} credits
                </p>
                {pack.bonus > 0 && (
                  <p className="text-sm text-green-600 font-semibold">
                    +{pack.bonus.toLocaleString()} bonus!
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <PayPalButton
                  type="credits"
                  amount={pack.price}
                  creditAmount={pack.totalCredits}
                  onSuccess={() => {
                    fetchCredits();
                  }}
                />
                <button
                  onClick={() => {
                    setSelectedPack(pack);
                    setShowCryptoModal(true);
                    setSubmitMessage(null);
                    setMessage("");
                    setPreferredCrypto("BTC");
                  }}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300"
                >
                  💰 Pay with Crypto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crypto Payment Modal */}
      {showCryptoModal && selectedPack && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowCryptoModal(false);
            setSelectedPack(null);
          }}
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
                    <strong>Package:</strong> {selectedPack.name}
                  </p>
                  <p>
                    <strong>Credits:</strong>{" "}
                    {selectedPack.totalCredits.toLocaleString()}
                  </p>
                  {selectedPack.bonus > 0 && (
                    <p className="text-green-700">
                      <strong>Bonus:</strong> +
                      {selectedPack.bonus.toLocaleString()} credits
                    </p>
                  )}
                  <p>
                    <strong>Amount:</strong> ${selectedPack.price} USD
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
                  blockchain, your credits will be added to your account
                  immediately.
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
                  onClick={() => {
                    setShowCryptoModal(false);
                    setSelectedPack(null);
                  }}
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

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recent Radium Credit Transactions
        </h2>
        {credits?.transactions && credits.transactions.length > 0 ? (
          <div className="space-y-2">
            {credits.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {getTransactionIcon(transaction.type)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type.replace("_", " ")}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-gray-600">
                        {transaction.description}
                      </p>
                    )}
                    {transaction.site && (
                      <p className="text-sm text-gray-500">
                        Site: {transaction.site.name || transaction.site.domain}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Balance: {transaction.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">
              Purchase credits or use features to see transactions here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
