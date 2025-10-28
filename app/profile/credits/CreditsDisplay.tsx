"use client";

import { useEffect, useState } from "react";
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
  const [credits, setCredits] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);

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
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1">
              Available Credits
            </p>
            <p className="text-5xl font-bold">
              {credits?.balance.toLocaleString() || 0}
            </p>
            <p className="text-purple-200 text-sm mt-2">
              Lifetime: {credits?.lifetime.toLocaleString() || 0} credits
            </p>
          </div>
          <div className="text-6xl">💎</div>
        </div>
      </div>

      {/* Purchase Packs */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Purchase Credits
        </h2>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cryptocurrency Payment</h3>
            <p className="text-gray-600 mb-4">
              To purchase{" "}
              <strong>{selectedPack.totalCredits.toLocaleString()}</strong>{" "}
              credits for <strong>${selectedPack.price}</strong> using
              cryptocurrency:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-6 text-sm text-gray-700">
              <li>
                Contact us at{" "}
                <strong className="text-purple-600">
                  admin@yourdomain.com
                </strong>
              </li>
              <li>
                Specify: &quot;{selectedPack.name} -{" "}
                {selectedPack.totalCredits.toLocaleString()} credits&quot;
              </li>
              <li>We&apos;ll provide wallet addresses for BTC, ETH, or USDT</li>
              <li>Send payment to the provided address</li>
              <li>Reply with your transaction hash</li>
              <li>Credits will be added within 1 hour of confirmation</li>
            </ol>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Quick Tip:</strong> Include your account email in
                your message for faster processing!
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:admin@yourdomain.com?subject=Crypto Payment: ${selectedPack.name} - ${selectedPack.totalCredits} Credits&body=Hi, I'd like to purchase ${selectedPack.totalCredits} credits (${selectedPack.name}) for $${selectedPack.price} using cryptocurrency.%0D%0A%0D%0AMy account email: [Your Email]%0D%0APreferred crypto: [BTC/ETH/USDT]%0D%0A%0D%0AThank you!`}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center font-semibold"
              >
                📧 Email Us
              </a>
              <button
                onClick={() => {
                  setShowCryptoModal(false);
                  setSelectedPack(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recent Transactions
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
