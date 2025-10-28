"use client";

import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

interface Transaction {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string;
  amount: number;
  balance: number;
  description: string;
  createdAt: string;
}

export default function ManualCreditAdjustment() {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("crypto");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/admin/credits/manual-adjust");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Search for user by email
      const response = await fetch(
        `/api/admin/users/search?email=${encodeURIComponent(searchEmail)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setSelectedUserId(data.user.id);
          setMessage({
            type: "success",
            text: `Found user: ${data.user.name || data.user.email}`,
          });
        } else {
          setMessage({ type: "error", text: "User not found" });
        }
      } else {
        setMessage({ type: "error", text: "Error searching for user" });
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setMessage({ type: "error", text: "Error searching for user" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustCredits = async (adjustmentType: "add" | "subtract") => {
    if (!selectedUserId || !amount || !description) {
      setMessage({
        type: "error",
        text: "Please fill in all fields and search for a user first",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const finalAmount = adjustmentType === "add" ? numAmount : -numAmount;

      const response = await fetch("/api/admin/credits/manual-adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          amount: finalAmount,
          description,
          paymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({
          type: "success",
          text: `Successfully ${
            adjustmentType === "add" ? "added" : "removed"
          } ${Math.abs(finalAmount)} EZ Credits. New balance: ${
            data.credit.balance
          }`,
        });

        // Reset form
        setAmount("");
        setDescription("");
        setSearchEmail("");
        setSelectedUserId("");

        // Refresh transactions
        await fetchTransactions();
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to adjust credits",
        });
      }
    } catch (error) {
      console.error("Error adjusting credits:", error);
      setMessage({ type: "error", text: "Failed to adjust credits" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Adjustment Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Adjust User EZ Credits</h2>

        {/* Search User */}
        <form onSubmit={handleSearchUser} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search User by Email
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchEmail}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {selectedUserId && (
          <>
            {/* Credit Adjustment */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  min="1"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="crypto">Cryptocurrency</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description / Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., Received BTC payment of $50 via wallet xyz..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAdjustCredits("add")}
                  disabled={saving || !amount || !description}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <PlusIcon className="h-5 w-5" />
                  {saving ? "Processing..." : "Add EZ Credits"}
                </button>

                <button
                  onClick={() => handleAdjustCredits("subtract")}
                  disabled={saving || !amount || !description}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  <MinusIcon className="h-5 w-5" />
                  {saving ? "Processing..." : "Remove EZ Credits"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Adjustments */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Manual Adjustments</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance After
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No manual adjustments yet
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.userName || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.userEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.balance}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
