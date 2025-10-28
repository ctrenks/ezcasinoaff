"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EZCreditData {
  balance: number;
  lifetime: number;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    balance: number;
    description: string | null;
    createdAt: string;
  }>;
}

export default function EZCreditsDisplay() {
  const [credits, setCredits] = useState<EZCreditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/ez-credits");
      if (response.ok) {
        const data = await response.json();
        setCredits(data);
      }
    } catch (error) {
      console.error("Failed to fetch EZ credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "PURCHASE":
      case "BONUS":
      case "REFUND":
      case "ADMIN_ADJUST":
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
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1">
              EZ Credits (Payment Currency)
            </p>
            <p className="text-5xl font-bold">
              {credits?.balance.toLocaleString() || 0}
            </p>
            <p className="text-purple-200 text-sm mt-2">
              Lifetime: {credits?.lifetime.toLocaleString() || 0} credits
            </p>
            <p className="text-purple-100 text-xs mt-1">
              💵 1 EZ Credit = $1 USD
            </p>
          </div>
          <div className="text-6xl">💎</div>
        </div>
      </div>

      {/* Usage Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 How to Use EZ Credits
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">✓</span>
            <span>
              <strong>Pay for Subscriptions:</strong> Use EZ Credits to pay for
              site subscriptions at a 1:1 rate ($1 = 1 credit)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">✓</span>
            <span>
              <strong>Convert to Radium Credits:</strong> Exchange 4 EZ Credits
              for 1 Radium Credit to generate AI reviews
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">✓</span>
            <span>
              <strong>Purchase More:</strong> Contact{" "}
              <a
                href="mailto:support@ezcasinoaff.com"
                className="underline font-semibold"
              >
                support@ezcasinoaff.com
              </a>{" "}
              to buy EZ Credits via cryptocurrency
            </span>
          </li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/pricing"
          className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-2 border-purple-200 hover:border-purple-400"
        >
          <div className="text-3xl mb-2">💳</div>
          <h3 className="font-bold text-gray-900 mb-1">Pay for Subscription</h3>
          <p className="text-sm text-gray-600">
            Use your EZ Credits to activate or renew site subscriptions
          </p>
        </Link>

        <a
          href="mailto:support@ezcasinoaff.com?subject=Purchase EZ Credits via Cryptocurrency"
          className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-2 border-purple-200 hover:border-purple-400"
        >
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-bold text-gray-900 mb-1">Purchase EZ Credits</h3>
          <p className="text-sm text-gray-600">
            Contact support to buy EZ Credits with cryptocurrency
          </p>
        </a>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recent EZ Credit Transactions
        </h2>
        {credits?.transactions && credits.transactions.length > 0 ? (
          <div className="space-y-2">
            {credits.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {transaction.description || transaction.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    Balance: {transaction.balance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💎</div>
            <p className="text-gray-600 mb-2">No transactions yet</p>
            <p className="text-sm text-gray-500">
              Your EZ Credit transaction history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
