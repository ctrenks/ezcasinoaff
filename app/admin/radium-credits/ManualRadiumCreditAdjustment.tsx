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

export default function ManualRadiumCreditAdjustment() {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("manual");
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
      const response = await fetch("/api/admin/radium-credits/manual-adjust");
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
      const response = await fetch(
        `/api/admin/users/search?email=${encodeURIComponent(searchEmail)}`
      );
      const data = await response.json();

      if (response.ok && data.user) {
        setSelectedUserId(data.user.id);
        setMessage({
          type: "success",
          text: `User found: ${data.user.name || "No name"} (${
            data.user.email
          }) - Radium Balance: ${data.user.radiumCreditBalance || 0}`,
        });
      } else {
        setMessage({
          type: "error",
          text: "User not found or doesn't have ezcasino access",
        });
        setSelectedUserId("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error searching for user",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustCredits = async (adjustmentType: "add" | "subtract") => {
    if (!selectedUserId || !amount || !description) {
      setMessage({
        type: "error",
        text: "Please fill in all fields",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    const finalAmount =
      adjustmentType === "add" ? parseInt(amount) : -Math.abs(parseInt(amount));

    try {
      const response = await fetch("/api/admin/radium-credits/manual-adjust", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          } ${Math.abs(finalAmount)} Radium Credits. New balance: ${
            data.credit.balance
          }`,
        });

        // Reset form
        setAmount("");
        setDescription("");
        setSearchEmail("");
        setSelectedUserId("");

        // Refresh transactions
        fetchTransactions();
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to adjust credits",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error adjusting credits",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm text-indigo-900">
          💡 <strong>Note:</strong> This page manages{" "}
          <strong>Radium Credits</strong> (AI review generation). For EZ Credits
          (payment currency), use the{" "}
          <a href="/admin/credits" className="underline font-semibold">
            EZ Credits admin page
          </a>
          .
        </p>
      </div>

      {/* Adjustment Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Adjust User Radium Credits
        </h2>

        {/* Search User */}
        <form onSubmit={handleSearchUser} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search User by Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Adjustment Form */}
        {selectedUserId && (
          <>
            <div className="border-t pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Radium Credits)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  ~$3-4 USD per Radium Credit
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Promotional bonus, refund, etc."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method / Source
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="manual">Manual Adjustment</option>
                  <option value="promotion">Promotion</option>
                  <option value="refund">Refund</option>
                  <option value="compensation">Compensation</option>
                  <option value="bonus">Bonus</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAdjustCredits("add")}
                  disabled={saving || !amount || !description}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <PlusIcon className="h-5 w-5" />
                  {saving ? "Processing..." : "Add Radium Credits"}
                </button>

                <button
                  onClick={() => handleAdjustCredits("subtract")}
                  disabled={saving || !amount || !description}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  <MinusIcon className="h-5 w-5" />
                  {saving ? "Processing..." : "Remove Radium Credits"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Adjustments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">
                      {transaction.userName || "No name"}
                    </div>
                    <div className="text-gray-500">{transaction.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`font-semibold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {transaction.balance}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
