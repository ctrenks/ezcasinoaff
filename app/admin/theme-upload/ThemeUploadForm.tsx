"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ThemeUploadForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [themeName, setThemeName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [changelog, setChangelog] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a theme ZIP file");
      return;
    }

    if (!themeName) {
      setError("Please enter a theme name");
      return;
    }

    if (!version) {
      setError("Please enter a version number");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("themeName", themeName);
      formData.append("version", version);
      formData.append("description", description);
      formData.append("changelog", changelog);

      const response = await fetch("/api/admin/theme-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(`Theme ${themeName} v${version} uploaded successfully!`);
      setFile(null);
      setThemeName("");
      setVersion("");
      setDescription("");
      setChangelog("");

      // Reset file input
      const fileInput = document.getElementById(
        "theme-file"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh the page to show new upload
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Upload New Theme Version
      </h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="theme-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Theme Name *
          </label>
          <input
            type="text"
            id="theme-name"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="e.g., Radium Casino Theme"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="version"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Version Number * (format: X.Y.Z)
          </label>
          <input
            type="text"
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g., 1.0.0"
            pattern="^\d+\.\d+\.\d+$"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this version"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="changelog"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Changelog
          </label>
          <textarea
            id="changelog"
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            placeholder="List of changes in this version..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="theme-file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Theme ZIP File *
          </label>
          <input
            type="file"
            id="theme-file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload a ZIP file containing your WordPress theme
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Theme"}
        </button>
      </form>
    </div>
  );
}
