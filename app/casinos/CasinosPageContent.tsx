"use client";

import { useState } from "react";
import CasinosList from "./CasinosList";
import AffiliatesList from "./AffiliatesList";

export default function CasinosPageContent() {
  const [activeTab, setActiveTab] = useState<"casinos" | "affiliates">("casinos");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Casino Brands</h1>
        <p className="text-gray-600">
          Browse active casino brands and affiliate programs
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("casinos")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition ${
              activeTab === "casinos"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span className="flex items-center">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              All Casinos
            </span>
          </button>
          <button
            onClick={() => setActiveTab("affiliates")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition ${
              activeTab === "affiliates"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span className="flex items-center">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              By Affiliate Program
            </span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === "casinos" ? <CasinosList /> : <AffiliatesList />}
      </div>
    </div>
  );
}

