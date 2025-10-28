"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string | null;
  email: string;
  commissionRate: number;
  referralCode: string | null;
  createdAt: string;
  _count: {
    referrals: number;
    commissionsEarned: number;
  };
}

interface UsersData {
  users: User[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function AffiliateManagement() {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRate, setNewRate] = useState<number>(15);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: "20",
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(
        `/api/admin/referrals/commission-rate?${params}`
      );
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const startEdit = (user: User) => {
    setEditingUser(user.id);
    setNewRate(Number(user.commissionRate));
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setNewRate(15);
  };

  const saveCommissionRate = async (userId: string) => {
    if (newRate < 0 || newRate > 100) {
      alert("Commission rate must be between 0 and 100");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/referrals/commission-rate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          commissionRate: newRate,
        }),
      });

      if (response.ok) {
        // Refresh the list
        await fetchUsers();
        setEditingUser(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating commission rate:", error);
      alert("Failed to update commission rate");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {data.pagination.totalCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Users with Referrals</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {data.users.filter((u) => u._count.referrals > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Active Affiliates</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {data.users.filter((u) => u.referralCode).length}
            </p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referral Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data && data.users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                data?.users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.referralCode ? (
                        <span className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">
                          {user.referralCode}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not generated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={newRate}
                            onChange={(e) =>
                              setNewRate(parseFloat(e.target.value))
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            disabled={saving}
                          />
                          <span className="text-sm">%</span>
                          <button
                            onClick={() => saveCommissionRate(user.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {saving ? "..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={saving}
                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {Number(user.commissionRate)}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {user._count.referrals}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {user._count.commissionsEarned}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser !== user.id && (
                        <button
                          onClick={() => startEdit(user)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit Rate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing page {data.pagination.page} of{" "}
              {data.pagination.totalPages} ({data.pagination.totalCount} total
              users)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(data.pagination.totalPages, p + 1)
                  )
                }
                disabled={currentPage === data.pagination.totalPages || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
