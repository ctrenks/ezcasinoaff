"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Casino {
  id: number;
  casino: string | null;
  clean_name: string | null;
  url: string | null;
  vercel_image_url: string | null;
  homepageimage: string | null;
  aff_id: number | null;
  affiliate: {
    aff_name: string;
  } | null;
}

export default function CasinosList() {
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCasinos() {
      try {
        const response = await fetch("/api/casinos");
        if (response.ok) {
          const data = await response.json();
          setCasinos(data);
        }
      } catch (error) {
        console.error("Failed to fetch casinos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCasinos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (casinos.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
        <p>No active casinos found in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {casinos.map((casino) => (
        <div
          key={casino.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4">
            {casino.vercel_image_url || casino.homepageimage ? (
              <img
                src={casino.vercel_image_url || casino.homepageimage || ""}
                alt={casino.casino || "Casino"}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-4xl">🎰</div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              {casino.casino}
            </h3>
            {casino.affiliate && (
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Affiliate:</span>{" "}
                {casino.affiliate.aff_name}
              </p>
            )}
            {casino.url && (
              <a
                href={casino.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Visit Casino
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

