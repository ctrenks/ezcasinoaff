"use client";

import { useState } from "react";
import { User } from "next-auth";

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    website: "",
    company: "",
    image: user.image || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setProfile({ ...profile, image: data.url });
        setMessage("Image uploaded successfully!");
      } else {
        setMessage(data.error || "Failed to upload image. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred while uploading. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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

      <form onSubmit={handleSave} className="bg-white shadow-md rounded-lg p-8">
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
            <div className="flex-1">
              <div className="mb-3">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG, GIF or WebP (max 5MB)
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Or enter a URL:</span>
                <input
                  type="url"
                  value={profile.image}
                  onChange={(e) =>
                    setProfile({ ...profile, image: e.target.value })
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          API Access
          <span className="ml-2 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Demo Key
          </span>
        </h2>
        <p className="text-gray-600 mb-4">
          Your demo API key provides access to casino and game data for testing
          purposes.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your API Key
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 font-mono text-sm">
              {user.apiKey || "No API key assigned"}
            </code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(user.apiKey || "");
                setMessage("API key copied to clipboard!");
              }}
              disabled={!user.apiKey}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Demo API Access
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            Your demo API key provides limited access for testing and
            evaluation:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-blue-800">
            <li>Up to 50 approved casino brands</li>
            <li>Up to 200 games with playable demos</li>
            <li>All active payment methods and software providers</li>
            <li>Geographic restriction data</li>
            <li>Jurisdiction and licensing information</li>
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Site Management (Coming Soon)
          </h3>
          <p className="text-sm text-purple-800">
            Soon you&apos;ll be able to add and manage multiple sites, each with
            their own API access and subscription level. Upgrade to a paid plan
            for unlimited access and advanced features.
          </p>
        </div>
      </div>
    </div>
  );
}
