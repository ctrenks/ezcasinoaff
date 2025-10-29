"use client";

import { useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export default function PluginUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [changelog, setChangelog] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
      setLoading(true);

      try {
        // Analyze ZIP file to extract version and changelog
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch("/api/admin/plugin-upload/analyze", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();

          // Auto-fill version if found
          if (data.version && !version) {
            setVersion(data.version);
          }

          // Auto-fill description if found
          if (data.description && !description) {
            setDescription(data.description);
          }

          // Auto-fill changelog if found
          if (data.changelog && !changelog) {
            setChangelog(data.changelog);
          }

          if (data.version || data.changelog) {
            setMessage({
              type: "success",
              text: `Auto-detected: ${
                data.version ? `Version ${data.version}` : ""
              }${data.version && data.changelog ? ", " : ""}${
                data.changelog ? "Changelog extracted" : ""
              }`,
            });
          }
        } else {
          // Fallback: Try to extract version from filename
          const match = selectedFile.name.match(/(\d+\.\d+\.\d+)/);
          if (match && !version) {
            setVersion(match[1]);
            setMessage({
              type: "success",
              text: `Version detected from filename: ${match[1]}`,
            });
          }
        }
      } catch (error) {
        console.error("Error analyzing plugin:", error);
        // Fallback: Try to extract version from filename
        const match = selectedFile.name.match(/(\d+\.\d+\.\d+)/);
        if (match && !version) {
          setVersion(match[1]);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    if (!version) {
      setMessage({ type: "error", text: "Please enter a version number" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("version", version);
      formData.append("description", description);
      formData.append("changelog", changelog);

      const response = await fetch("/api/admin/plugin-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Version ${version} uploaded successfully!`,
        });
        setFile(null);
        setVersion("");
        setDescription("");
        setChangelog("");

        // Reset file input
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Refresh the page to show new upload
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: "An error occurred during upload",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-semibold mb-6">Upload New Version</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label
            htmlFor="file-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Plugin ZIP File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition">
            <div className="space-y-1 text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-input"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-input"
                    type="file"
                    className="sr-only"
                    accept=".zip"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">ZIP file up to 50MB</p>
              {file && (
                <p className="text-sm font-medium text-purple-600 mt-2">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                  MB)
                </p>
              )}
              {loading && (
                <p className="text-sm font-medium text-blue-600 mt-2">
                  🔍 Analyzing plugin...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Version Number */}
        <div>
          <label
            htmlFor="version"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Version Number
          </label>
          <input
            type="text"
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            pattern="\d+\.\d+\.\d+"
            title="Version must be in format X.Y.Z (e.g., 1.0.0)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: X.Y.Z (e.g., 1.2.3)
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bug fix release, Major update, Security patch, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Short summary of this release (e.g., &quot;Bug fix&quot;,
            &quot;Major update&quot;)
          </p>
        </div>

        {/* Changelog */}
        <div>
          <label
            htmlFor="changelog"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Changelog (Optional)
          </label>
          <textarea
            id="changelog"
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            placeholder="- Added new feature&#10;- Fixed bug in X&#10;- Improved performance"
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Describe what&apos;s new in this version
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !file || !version}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          {uploading ? "Uploading..." : "Upload Plugin"}
        </button>
      </form>
    </div>
  );
}
