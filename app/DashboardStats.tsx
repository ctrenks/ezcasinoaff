"use client";

import { useEffect, useState } from "react";

interface Stats {
  casinos: number;
  games: number;
  gamesWithDemos: number;
  banks: number;
  software: number;
  jurisdictions: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-12 text-red-800">
        Failed to load statistics. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Active Casinos
        </h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {stats.casinos.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-1">Approved & non-rogue</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Total Games
        </h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {stats.games.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-1">In our database</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-600">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Games with Demos
        </h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {stats.gamesWithDemos.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-1">SlotsLaunch playable demos</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Payment Methods
        </h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {stats.banks.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-1">Active payment options</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Software Providers
        </h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {stats.software.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-1">Active game providers</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
        <h3 className="text-gray-500 text-sm font-medium uppercase">
          Jurisdictions
        </h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {stats.jurisdictions.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-1">Active licensing authorities</p>
      </div>
    </div>
  );
}

