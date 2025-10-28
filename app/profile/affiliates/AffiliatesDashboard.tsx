"use client";

import { useEffect, useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

interface ReferredUser {
  id: string;
  name: string | null;
  email: string;
  joinedAt: string;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
}

interface Commission {
  id: string;
  amount: number;
  percentage: number;
  status: string;
  paymentAmount: number;
  referredUserName: string | null;
  referredUserEmail: string;
  paidAt: string | null;
  createdAt: string;
}

interface ReferralData {
  referralCode: string;
  referralUrl: string;
  commissionRate: number;
  stats: ReferralStats;
  referredUsers: ReferredUser[];
  commissions: Commission[];
}

export default function AffiliatesDashboard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "earnings">(
    "overview"
  );

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch("/api/referrals");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load referral data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Terms & Conditions Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Program Terms</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • You will receive <strong>{data.commissionRate}%</strong> of each
            payment from users you refer
          </li>
          <li>
            • Commissions are paid out on the following month after payment is
            received
          </li>
          <li>
            • We have full discretion on determining any fraud or misuse of this
            program
          </li>
          <li>• Commission rates may be adjusted at our discretion</li>
        </ul>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {data.stats.totalReferrals}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${data.stats.totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Earnings</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                ${data.stats.pendingEarnings.toFixed(2)}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Commission Rate Display */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your Commission Rate</h3>
            <p className="text-sm opacity-90 mt-1">
              You&apos;re on a {data.commissionRate}% revshare deal
            </p>
          </div>
          <div className="text-5xl font-bold">{data.commissionRate}%</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Referral Link
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={data.referralUrl}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
          <button
            onClick={() => copyToClipboard(data.referralUrl)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {copied ? (
              <>
                <CheckIcon className="h-5 w-5" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardIcon className="h-5 w-5" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Share this link with potential users to earn commissions on their
          payments
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "users"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Referred Users ({data.referredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "earnings"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Earnings History ({data.commissions.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === "overview" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium">Active Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.stats.totalReferrals}
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">Commission Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.commissionRate}%
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-medium">Lifetime Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${data.stats.totalEarnings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.referredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No referred users yet. Share your referral link to get
                      started!
                    </td>
                  </tr>
                ) : (
                  data.referredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "Anonymous"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastPaymentDate
                          ? new Date(user.lastPaymentDate).toLocaleDateString()
                          : "No payments yet"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastPaymentAmount
                          ? `$${user.lastPaymentAmount.toFixed(2)}`
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "earnings" && (
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
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.commissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No earnings yet. Commissions will appear here when your
                      referrals make payments.
                    </td>
                  </tr>
                ) : (
                  data.commissions.map((commission) => (
                    <tr key={commission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {commission.referredUserName || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {commission.referredUserEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${commission.paymentAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${commission.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {commission.percentage}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            commission.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : commission.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {commission.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
