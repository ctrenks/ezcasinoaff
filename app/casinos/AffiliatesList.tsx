"use client";

import { useEffect, useState } from "react";

interface Casino {
  id: number;
  casino: string | null;
  clean_name: string | null;
  url: string | null;
  vercel_casino_button: string | null;
}

interface Affiliate {
  id: number;
  aff_name: string;
  aff_url: string;
  referralLink: string | null;
  casinos: Casino[];
}

export default function AffiliatesList() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAffiliates() {
      try {
        const response = await fetch("/api/affiliates");
        if (response.ok) {
          const data = await response.json();
          setAffiliates(data);
        }
      } catch (error) {
        console.error("Failed to fetch affiliates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliates();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (affiliates.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
        <p>No active affiliates found with casinos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {affiliates.map((affiliate) => (
        <div key={affiliate.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {affiliate.aff_name}
              </h3>
              <p className="text-gray-600 text-sm">
                {affiliate.casinos.length} active casino
                {affiliate.casinos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <a
              href={affiliate.referralLink || affiliate.aff_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              {affiliate.referralLink ? "Join Program" : "Visit Affiliate"}
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {affiliate.casinos.map((casino) => (
              <div
                key={casino.id}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
              >
                <div className="h-20 bg-white rounded flex items-center justify-center p-2 mb-2">
                  {casino.vercel_casino_button ? (
                    <img
                      src={casino.vercel_casino_button}
                      alt={casino.casino || "Casino"}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-2xl">🎰</div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 text-center truncate">
                  {casino.casino}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
