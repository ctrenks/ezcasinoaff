"use client";

import { useEffect, useState } from "react";

interface Casino {
  id: number;
  casino: string | null;
  clean_name: string | null;
  url: string | null;
  vercel_image_url: string | null;
  homepageimage: string | null;
}

interface Affiliate {
  id: number;
  aff_name: string;
  aff_url: string;
  referralLink: string | null;
  casinos: Casino[];
}

export default function AffiliatesProgramList() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (affiliates.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
        <p>No active affiliate programs found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {affiliates.map((affiliate) => (
        <div
          key={affiliate.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {affiliate.aff_name}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>
                {affiliate.casinos.length} active casino
                {affiliate.casinos.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="p-6 flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Featured Casinos:
            </h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {affiliate.casinos.slice(0, 6).map((casino) => (
                <div
                  key={casino.id}
                  className="bg-gray-50 rounded p-2 flex items-center justify-center"
                  title={casino.casino || ""}
                >
                  {casino.vercel_image_url || casino.homepageimage ? (
                    <img
                      src={
                        casino.vercel_image_url || casino.homepageimage || ""
                      }
                      alt={casino.casino || "Casino"}
                      className="max-h-8 max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-lg">🎰</div>
                  )}
                </div>
              ))}
            </div>
            {affiliate.casinos.length > 6 && (
              <p className="text-xs text-gray-500 text-center">
                +{affiliate.casinos.length - 6} more
              </p>
            )}
          </div>

          <div className="p-6 pt-0">
            <a
              href={affiliate.referralLink || affiliate.aff_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              <span className="flex items-center justify-center">
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
              </span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
