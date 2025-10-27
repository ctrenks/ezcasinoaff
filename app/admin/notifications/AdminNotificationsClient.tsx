"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminNotificationsClient() {
  const [activeTab, setActiveTab] = useState<"casino" | "games" | "broadcast">(
    "broadcast"
  );
  const [loading, setLoading] = useState(false);

  // Casino form
  const [casinoName, setCasinoName] = useState("");
  const [casinoId, setCasinoId] = useState("");

  // Games form
  const [gameCount, setGameCount] = useState("");
  const [provider, setProvider] = useState("");

  // Broadcast form
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [icon, setIcon] = useState("📢");
  const [notifType, setNotifType] = useState("SYSTEM");

  const handleCasinoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/notifications/casino", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ casinoName, casinoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notifications");
      }

      toast.success(data.message);
      setCasinoName("");
      setCasinoId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleGamesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/notifications/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameCount: parseInt(gameCount),
          provider: provider || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notifications");
      }

      toast.success(data.message);
      setGameCount("");
      setProvider("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          link: link || undefined,
          icon,
          type: notifType,
          targetAllUsers: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notifications");
      }

      toast.success(data.message);
      setTitle("");
      setMessage("");
      setLink("");
      setIcon("📢");
    } catch (error: any) {
      toast.error(error.message || "Failed to send notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`flex-1 px-6 py-4 text-center font-medium transition ${
              activeTab === "broadcast"
                ? "bg-purple-50 text-purple-700 border-b-2 border-purple-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            📢 Broadcast
          </button>
          <button
            onClick={() => setActiveTab("casino")}
            className={`flex-1 px-6 py-4 text-center font-medium transition ${
              activeTab === "casino"
                ? "bg-purple-50 text-purple-700 border-b-2 border-purple-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            🎰 New Casino
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`flex-1 px-6 py-4 text-center font-medium transition ${
              activeTab === "games"
                ? "bg-purple-50 text-purple-700 border-b-2 border-purple-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            🎮 New Games
          </button>
        </div>

        {/* Forms */}
        <div className="p-6">
          {activeTab === "broadcast" && (
            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., System Maintenance Scheduled"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter the notification message..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="📢"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="SYSTEM">SYSTEM</option>
                    <option value="NEW_CASINO">NEW_CASINO</option>
                    <option value="NEW_GAME">NEW_GAME</option>
                    <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link (optional)
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="/announcements"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-semibold"
              >
                {loading ? "Sending..." : "📢 Send to All Users"}
              </button>
            </form>
          )}

          {activeTab === "casino" && (
            <form onSubmit={handleCasinoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Casino Name *
                </label>
                <input
                  type="text"
                  value={casinoName}
                  onChange={(e) => setCasinoName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Betway Casino"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Casino ID *
                </label>
                <input
                  type="text"
                  value={casinoId}
                  onChange={(e) => setCasinoId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., betway123"
                  required
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900">
                  <strong>Preview:</strong> All users will receive a
                  notification:
                  <br />
                  <span className="text-purple-700 mt-2 block">
                    🎰 New Casino Added: {casinoName || "[Casino Name]"} has
                    been added to the database
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-semibold"
              >
                {loading ? "Sending..." : "🎰 Notify All Users"}
              </button>
            </form>
          )}

          {activeTab === "games" && (
            <form onSubmit={handleGamesSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Games *
                </label>
                <input
                  type="number"
                  value={gameCount}
                  onChange={(e) => setGameCount(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., 50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider (optional)
                </label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., NetEnt, Pragmatic Play"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900">
                  <strong>Preview:</strong> All users will receive a
                  notification:
                  <br />
                  <span className="text-purple-700 mt-2 block">
                    🎮 New Games Added:{" "}
                    {provider
                      ? `${
                          gameCount || "[Count]"
                        } new games from ${provider} have been added`
                      : `${
                          gameCount || "[Count]"
                        } new games have been added to the database`}
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-semibold"
              >
                {loading ? "Sending..." : "🎮 Notify All Users"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
