"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
  CheckIcon,
  GlobeAltIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface Site {
  id: string;
  domain: string;
  name: string | null;
  apiKey: string;
  isActive: boolean;
  status: string;
  createdAt: string;
  lastAccessAt: string | null;
  subscription: {
    status: string;
    plan: string;
  } | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: number;
  apiKey: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  skype: string | null;
  telegram: string | null;
  referralCode: string | null;
  commissionRate: number;
  ezcasino: boolean;
  allmedia: boolean;
  sites: Site[];
  userCredit: { balance: number; lifetime: number } | null;
  radiumCredit: { balance: number; lifetime: number } | null;
  _count: {
    sites: number;
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

const roleLabels: Record<number, string> = {
  1: "Guest",
  2: "User",
  3: "Contributor",
  4: "Admin",
  5: "Super Admin",
};

export default function UserManagement() {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [hasSitesFilter, setHasSitesFilter] = useState<string>("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: "25",
        sortBy,
        sortOrder,
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (hasSitesFilter !== "all") {
        params.append("hasSites", hasSitesFilter);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder, hasSitesFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const toggleUserExpanded = (userId: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 inline ml-1" />
    );
  };

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copyToClipboard(text, id);
      }}
      className="p-1 hover:bg-gray-200 rounded transition"
      title="Copy to clipboard"
    >
      {copiedId === id ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <ClipboardIcon className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      SUSPENDED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
              placeholder="Search by name, email, user ID, or API key..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={hasSitesFilter}
            onChange={(e) => {
              setHasSitesFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="true">With Sites</option>
            <option value="false">Without Sites</option>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total EZ Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {data.pagination.totalCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Users with Sites</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {data.users.filter((u) => u._count.sites > 0).length}
              <span className="text-sm text-gray-500 font-normal ml-1">
                (this page)
              </span>
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Sites</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {data.users.reduce((acc, u) => acc + u._count.sites, 0)}
              <span className="text-sm text-gray-500 font-normal ml-1">
                (this page)
              </span>
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">With User API Key</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {data.users.filter((u) => u.apiKey).length}
              <span className="text-sm text-gray-500 font-normal ml-1">
                (this page)
              </span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  {/* Expand */}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  User
                  <SortIcon field="name" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID / API Key
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("sitesCount")}
                >
                  Sites
                  <SortIcon field="sitesCount" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}
                >
                  Joined
                  <SortIcon field="createdAt" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-gray-600">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                data?.users.map((user) => (
                  <>
                    {/* User Row */}
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        expandedUsers.has(user.id) ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => toggleUserExpanded(user.id)}
                    >
                      <td className="px-6 py-4">
                        <button className="text-gray-500 hover:text-gray-700">
                          {expandedUsers.has(user.id) ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.image ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.image}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-indigo-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "No name"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  user.role === 5
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {roleLabels[user.role] || `Role ${user.role}`}
                              </span>
                              {user.allmedia && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  AllMedia
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">ID:</span>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {user.id}
                            </code>
                            <CopyButton text={user.id} id={`user-${user.id}`} />
                          </div>
                          {user.apiKey && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">API:</span>
                              <code className="text-xs bg-yellow-100 px-2 py-1 rounded font-mono">
                                {user.apiKey.substring(0, 12)}...
                              </code>
                              <CopyButton
                                text={user.apiKey}
                                id={`api-${user.id}`}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {user._count.sites}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          <div className="text-gray-900">
                            💰 {user.userCredit?.balance || 0} EZ
                          </div>
                          <div className="text-gray-900">
                            🤖 {user.radiumCredit?.balance || 0} Radium
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedUsers.has(user.id) && (
                      <tr key={`${user.id}-expanded`}>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* User Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Referral Code
                                </p>
                                <p className="text-sm font-medium">
                                  {user.referralCode || "None"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Commission Rate
                                </p>
                                <p className="text-sm font-medium">
                                  {Number(user.commissionRate)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Referrals</p>
                                <p className="text-sm font-medium">
                                  {user._count.referrals}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Email Verified
                                </p>
                                <p className="text-sm font-medium">
                                  {user.emailVerified ? "✅ Yes" : "❌ No"}
                                </p>
                              </div>
                              {user.skype && (
                                <div>
                                  <p className="text-xs text-gray-500">Skype</p>
                                  <p className="text-sm font-medium">
                                    {user.skype}
                                  </p>
                                </div>
                              )}
                              {user.telegram && (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Telegram
                                  </p>
                                  <p className="text-sm font-medium">
                                    {user.telegram}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Sites Section */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <GlobeAltIcon className="h-4 w-4 mr-2" />
                                Sites ({user.sites.length})
                              </h4>
                              {user.sites.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">
                                  No sites registered
                                </p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Domain
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Site ID
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Site API Key
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Status
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Plan
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Last Access
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {user.sites.map((site) => (
                                        <tr key={site.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 text-sm">
                                            <a
                                              href={`https://${site.domain}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-indigo-600 hover:text-indigo-800 font-medium"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {site.domain}
                                            </a>
                                            {site.name && (
                                              <span className="text-gray-500 ml-2">
                                                ({site.name})
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-4 py-2">
                                            <div className="flex items-center gap-1">
                                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                                {site.id}
                                              </code>
                                              <CopyButton
                                                text={site.id}
                                                id={`site-${site.id}`}
                                              />
                                            </div>
                                          </td>
                                          <td className="px-4 py-2">
                                            <div className="flex items-center gap-1">
                                              <code className="text-xs bg-green-100 px-2 py-1 rounded font-mono">
                                                <KeyIcon className="h-3 w-3 inline mr-1" />
                                                {site.apiKey.substring(0, 12)}...
                                              </code>
                                              <CopyButton
                                                text={site.apiKey}
                                                id={`siteapi-${site.id}`}
                                              />
                                            </div>
                                          </td>
                                          <td className="px-4 py-2">
                                            <span
                                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(
                                                site.status
                                              )}`}
                                            >
                                              {site.status}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-600">
                                            {site.subscription?.plan || "Free"}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-500">
                                            {site.lastAccessAt
                                              ? new Date(
                                                  site.lastAccessAt
                                                ).toLocaleDateString()
                                              : "Never"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(data.pagination.page - 1) * data.pagination.pageSize + 1}{" "}
              to{" "}
              {Math.min(
                data.pagination.page * data.pagination.pageSize,
                data.pagination.totalCount
              )}{" "}
              of {data.pagination.totalCount} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(data.pagination.totalPages, p + 1)
                  )
                }
                disabled={currentPage === data.pagination.totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
