"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteSubscriptionModal from "./SiteSubscriptionModal";

interface Site {
  id: string;
  domain: string;
  name: string | null;
  apiKey: string;
  status: string;
  isActive: boolean;
  hasGameScreenshots: boolean;
  hasBonusCodeFeed: boolean;
  createdAt: string;
  subscription: {
    id: string;
    plan: string;
    status: string;
    endDate: string | null;
    amount: number;
    monthlyRate: number;
  } | null;
  _count: {
    apiUsage: number;
  };
}

export default function SitesList() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/sites");
      if (response.ok) {
        const data = await response.json();
        setSites(data);
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (isActive && status === "ACTIVE") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    if (status === "INACTIVE") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    }
    if (status === "SUSPENDED") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Suspended
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🌐</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No sites yet</h3>
        <p className="text-gray-600 mb-6">
          Get started by adding your first site
        </p>
        <Link
          href="/profile/sites/add"
          className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Your First Site
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map((site) => (
        <div
          key={site.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {site.name || site.domain}
                </h3>
                <p className="text-sm text-gray-600">{site.domain}</p>
              </div>
              {getStatusBadge(site.status, site.isActive)}
            </div>

            {/* Subscription Status */}
            {site.subscription ? (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-green-900">
                    {site.subscription.plan} Plan
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {site.subscription.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-green-800">
                  <p>
                    <strong>${site.subscription.monthlyRate}/mo</strong> (${site.subscription.amount}/year)
                  </p>
                  {site.subscription.endDate && (
                    <p className="text-xs text-green-700">
                      Renews: {new Date(site.subscription.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-yellow-900">
                    No Active Subscription
                  </span>
                </div>
                <p className="text-xs text-yellow-800">
                  Subscribe to activate full API access
                </p>
              </div>
            )}

            <div className="space-y-2 mb-4">

              {site.hasGameScreenshots && (
                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Game Screenshots</span>
                </div>
              )}

              {site.hasBonusCodeFeed && (
                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Bonus Code Feed</span>
                </div>
              )}

              <div className="flex items-center text-sm">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-gray-700">
                  {site._count.apiUsage.toLocaleString()} API calls
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {site.subscription ? (
                <>
                  <button
                    onClick={() => {
                      setSelectedSite(site);
                      setShowSubscriptionModal(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm"
                  >
                    💳 Manage Subscription
                  </button>
                  <Link
                    href={`/profile/sites/${site.id}`}
                    className="text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition text-sm"
                  >
                    View Details
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedSite(site);
                      setShowSubscriptionModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm"
                  >
                    ➕ Add Subscription
                  </button>
                  <Link
                    href={`/profile/sites/${site.id}`}
                    className="text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition text-sm"
                  >
                    View Details
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        ))}
      </div>

      {/* Subscription Modal */}
      {selectedSite && (
        <SiteSubscriptionModal
          site={selectedSite}
          isOpen={showSubscriptionModal}
          onClose={() => {
            setShowSubscriptionModal(false);
            setSelectedSite(null);
            fetchSites(); // Refresh sites list
          }}
        />
      )}
    </>
  );
}
