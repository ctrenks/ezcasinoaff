"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SiteDetailsProps {
  site: {
    id: string;
    domain: string;
    name: string | null;
    description: string | null;
    apiKey: string;
    status: string;
    isActive: boolean;
    createdAt: Date;
    subscription: {
      plan: string;
      status: string;
      amount: number;
      startDate: Date | null;
      endDate: Date | null;
      autoRenew: boolean;
      payments: Array<{
        id: string;
        amount: number;
        status: string;
        type: string;
        createdAt: Date;
      }>;
    } | null;
    apiUsage: Array<{
      id: string;
      endpoint: string;
      requestCount: number;
      createdAt: Date;
    }>;
    radiumUsage: Array<{
      id: string;
      feature: string;
      creditsUsed: number;
      createdAt: Date;
    }>;
  };
}

export default function SiteDetailsClient({ site }: SiteDetailsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: site.name || "",
    description: site.description || "",
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Site updated successfully!");
        setEditing(false);
        router.refresh();
      } else {
        setMessage("Failed to update site");
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateKey = async () => {
    if (
      !confirm(
        "Are you sure? Your current API key will stop working immediately."
      )
    ) {
      return;
    }

    setRegenerating(true);
    setMessage("");

    try {
      const response = await fetch(`/api/sites/${site.id}/regenerate-key`, {
        method: "POST",
      });

      if (response.ok) {
        setMessage("API key regenerated successfully!");
        router.refresh();
      } else {
        setMessage("Failed to regenerate key");
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/profile/sites");
      } else {
        setMessage(data.error || "Failed to delete site");
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      setMessage("An error occurred");
      setShowDeleteConfirm(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage("API key copied to clipboard!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("success")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Site Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Site Information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: site.name || "",
                    description: site.description || "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Domain:</span>
              <p className="font-medium text-gray-900">{site.domain}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Name:</span>
              <p className="font-medium text-gray-900">
                {site.name || "Not set"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Description:</span>
              <p className="font-medium text-gray-900">
                {site.description || "Not set"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Created:</span>
              <p className="font-medium text-gray-900">
                {new Date(site.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* API Key */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">API Key</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono text-gray-900">
              {showApiKey ? site.apiKey : "••••••••••••••••••••••••••••••••"}
            </code>
            <div className="flex gap-2">
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => copyToClipboard(site.apiKey)}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleRegenerateKey}
          disabled={regenerating}
          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
        >
          {regenerating ? "Regenerating..." : "Regenerate API Key"}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          ⚠️ Regenerating will immediately invalidate the old key
        </p>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
          {!site.subscription && (
            <Link
              href="/pricing"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm"
            >
              Subscribe Now
            </Link>
          )}
        </div>

        {site.subscription ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Plan:</span>
                <p className="font-medium text-gray-900">
                  {site.subscription.plan}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <p className="font-medium text-gray-900">
                  {site.subscription.status}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Start Date:</span>
                <p className="font-medium text-gray-900">
                  {site.subscription.startDate
                    ? new Date(site.subscription.startDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">End Date:</span>
                <p className="font-medium text-gray-900">
                  {site.subscription.endDate
                    ? new Date(site.subscription.endDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Amount:</span>
                <p className="font-medium text-gray-900">
                  ${site.subscription.amount}/year
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Auto-Renew:</span>
                <p className="font-medium text-gray-900">
                  {site.subscription.autoRenew ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💳</div>
            <p className="text-gray-600 mb-4">
              No active subscription. Subscribe to activate this site.
            </p>
            <p className="text-sm text-gray-500">
              Plans start at $25/month (billed annually)
            </p>
          </div>
        )}
      </div>

      {/* Delete Site */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
        <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Once you delete a site, there is no going back. Please be certain.
        </p>

        {showDeleteConfirm ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-3">
              Are you absolutely sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                Yes, Delete Site
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={site.subscription?.status === "ACTIVE"}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete This Site
          </button>
        )}

        {site.subscription?.status === "ACTIVE" && (
          <p className="text-sm text-red-600 mt-2">
            ⚠️ Cannot delete site with active subscription
          </p>
        )}
      </div>
    </div>
  );
}
