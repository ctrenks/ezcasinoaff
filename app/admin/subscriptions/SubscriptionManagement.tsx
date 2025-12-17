"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface Site {
  id: string;
  domain: string;
  name: string | null;
  apiKey: string;
  isActive: boolean;
  status: string;
  hasGameScreenshots: boolean;
  hasBonusCodeFeed: boolean;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Subscription {
  id: string;
  siteId: string;
  userId: string;
  plan: string;
  status: string;
  amount: number;
  monthlyRate: number;
  currency: string;
  billingPeriod: string;
  startDate: string | null;
  endDate: string | null;
  nextBillingDate: string | null;
  cancelledAt: string | null;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
  site: Site | null;
  user: User;
  _count: {
    payments: number;
  };
}

interface SubscriptionsData {
  subscriptions: Subscription[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  stats: {
    byStatus: { status: string; _count: number }[];
    byPlan: { plan: string; _count: number }[];
  };
}

const PLANS = ["BASIC", "PRO", "EVERYTHING"];
const STATUSES = ["ACTIVE", "PENDING", "PAST_DUE", "CANCELLED", "EXPIRED"];

export default function SubscriptionManagement() {
  const [data, setData] = useState<SubscriptionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit form state
  const [editPlan, setEditPlan] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editAutoRenew, setEditAutoRenew] = useState(false);
  const [editAwardCredits, setEditAwardCredits] = useState(false);
  const [editReason, setEditReason] = useState("");

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: "25",
      });

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);
      if (planFilter) params.append("plan", planFilter);

      const response = await fetch(`/api/admin/subscriptions?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, planFilter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSubscriptions();
  };

  const startEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setEditPlan(subscription.plan);
    setEditStatus(subscription.status);
    setEditEndDate(subscription.endDate ? subscription.endDate.split("T")[0] : "");
    setEditAutoRenew(subscription.autoRenew);
    setEditAwardCredits(false);
    setEditReason("");
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingSubscription(null);
    setMessage(null);
  };

  const saveChanges = async () => {
    if (!editingSubscription) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: editingSubscription.id,
          plan: editPlan !== editingSubscription.plan ? editPlan : undefined,
          status: editStatus !== editingSubscription.status ? editStatus : undefined,
          endDate: editEndDate !== (editingSubscription.endDate?.split("T")[0] || "") ? editEndDate : undefined,
          autoRenew: editAutoRenew !== editingSubscription.autoRenew ? editAutoRenew : undefined,
          awardCredits: editAwardCredits,
          reason: editReason || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Subscription updated successfully!${result.creditsAwarded > 0 ? ` ${result.creditsAwarded} credits awarded.` : ""}`,
        });
        fetchSubscriptions();
        setTimeout(() => cancelEdit(), 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update subscription" });
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      PAST_DUE: "bg-orange-100 text-orange-800",
      CANCELLED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      BASIC: "bg-blue-100 text-blue-800",
      PRO: "bg-purple-100 text-purple-800",
      EVERYTHING: "bg-indigo-100 text-indigo-800",
    };
    return colors[plan] || "bg-gray-100 text-gray-800";
  };

  const getStatCount = (stats: { status: string; _count: number }[], status: string) => {
    return stats.find((s) => s.status === status)?._count || 0;
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by domain, site name, user email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Plans</option>
            {PLANS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stats Overview */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{data.pagination.totalCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {getStatCount(data.stats.byStatus, "ACTIVE")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {getStatCount(data.stats.byStatus, "PENDING")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {getStatCount(data.stats.byStatus, "CANCELLED")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-gray-600">
              {getStatCount(data.stats.byStatus, "EXPIRED")}
            </p>
          </div>
        </div>
      )}

      {/* Plan breakdown */}
      {data && data.stats.byPlan.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-2">Active Subscriptions by Plan</p>
          <div className="flex gap-4">
            {data.stats.byPlan.map((stat) => (
              <div key={stat.plan} className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPlanBadge(stat.plan)}`}>
                  {stat.plan}
                </span>
                <span className="font-bold">{stat._count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Site / User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <ArrowPathIcon className="animate-spin h-6 w-6 text-indigo-600 mr-2" />
                      Loading subscriptions...
                    </div>
                  </td>
                </tr>
              ) : data?.subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                data?.subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {sub.site?.domain || "No site"}
                        </p>
                        {sub.site?.name && (
                          <p className="text-sm text-gray-500">{sub.site.name}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {sub.user.name || sub.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPlanBadge(sub.plan)}`}>
                        {sub.plan}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        ${Number(sub.amount).toFixed(0)}/yr
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                      {sub.autoRenew && (
                        <p className="text-xs text-green-600 mt-1">Auto-renew</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          {sub.site?.hasGameScreenshots ? (
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-4 w-4 text-gray-300" />
                          )}
                          <span className="text-gray-600">Screenshots</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {sub.site?.hasBonusCodeFeed ? (
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-4 w-4 text-gray-300" />
                          )}
                          <span className="text-gray-600">Bonus Feed</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sub.startDate && (
                        <p>Start: {new Date(sub.startDate).toLocaleDateString()}</p>
                      )}
                      {sub.endDate && (
                        <p>End: {new Date(sub.endDate).toLocaleDateString()}</p>
                      )}
                      {sub.cancelledAt && (
                        <p className="text-red-500">
                          Cancelled: {new Date(sub.cancelledAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => startEdit(sub)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={currentPage === data.pagination.totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit Subscription</h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {editingSubscription.site?.domain || "No site"} - {editingSubscription.user.email}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {PLANS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {editPlan !== editingSubscription.plan && (
                  <p className="text-sm text-indigo-600 mt-1">
                    Changing from {editingSubscription.plan} to {editPlan}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Auto-Renew */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRenew"
                  checked={editAutoRenew}
                  onChange={(e) => setEditAutoRenew(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
                <label htmlFor="autoRenew" className="text-sm text-gray-700">
                  Auto-renew subscription
                </label>
              </div>

              {/* Award Credits (only show if upgrading plan) */}
              {editPlan !== editingSubscription.plan && (
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="awardCredits"
                      checked={editAwardCredits}
                      onChange={(e) => setEditAwardCredits(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                    <label htmlFor="awardCredits" className="text-sm text-indigo-800">
                      Award difference in Radium credits for plan upgrade
                    </label>
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">
                    Credits will be calculated based on the difference between old and new plan.
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason / Notes (optional)
                </label>
                <textarea
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Reason for change (will be included in user notification)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-4 justify-end">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
