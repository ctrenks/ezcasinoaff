"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function WebmasterProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    website: "",
    company: "",
    image: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        website: "",
        company: "",
        image: session.user.image || "",
      });
    }
  }, [session, status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("success")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={(e) => {
          void handleSave(e);
        }}
        className="bg-white shadow-md rounded-lg p-8"
      >
        {/* Profile Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center space-x-6">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-purple-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-3xl font-bold">
                {profile.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <input
                type="url"
                value={profile.image}
                onChange={(e) =>
                  setProfile({ ...profile, image: e.target.value })
                }
                placeholder="https://example.com/avatar.jpg"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-500 mt-1">Enter an image URL</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Website */}
        <div className="mb-6">
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Website URL
          </label>
          <input
            type="url"
            id="website"
            value={profile.website}
            onChange={(e) =>
              setProfile({ ...profile, website: e.target.value })
            }
            placeholder="https://yourwebsite.com"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Company */}
        <div className="mb-6">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Name
          </label>
          <input
            type="text"
            id="company"
            value={profile.company}
            onChange={(e) =>
              setProfile({ ...profile, company: e.target.value })
            }
            placeholder="Your Company LLC"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Account Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Account Information
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Account Type:</strong> Webmaster (Demo Access)
            </p>
            <p>
              <strong>API Access:</strong> Limited (up to 50 casinos, up to 200
              games)
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-semibold">Active</span>
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <a
            href="/api/auth/signout"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign Out
          </a>
        </div>
      </form>

      {/* API Key Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">API Access</h2>
        <p className="text-gray-600 mb-4">
          Your API key provides access to casino and game data for your website.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your API Key
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 font-mono text-sm">
              {session?.user?.apiKey || "Loading..."}
            </code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(session?.user?.apiKey || "");
                setMessage("API key copied to clipboard!");
              }}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Your access includes:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Up to 50 approved casino brands</li>
            <li>Up to 200 games with playable demos</li>
            <li>All active payment methods and software providers</li>
            <li>Geographic restriction data</li>
            <li>Jurisdiction and licensing information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
