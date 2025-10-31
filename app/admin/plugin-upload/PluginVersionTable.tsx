"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PluginVersion {
  id: string;
  version: string;
  fileName: string;
  fileSize: number;
  downloads: number;
  uploadedAt: Date;
  uploader: {
    name: string | null;
    email: string;
  };
}

export default function PluginVersionTable({
  versions,
}: {
  versions: PluginVersion[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string, version: string) => {
    // First click - show confirmation
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      // Reset confirmation after 5 seconds
      setTimeout(() => {
        setDeleteConfirm(null);
      }, 5000);
      return;
    }

    // Second click - actually delete
    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/plugin-upload/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete plugin version");
      }

      // Success - refresh the page
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete plugin version"
      );
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Version
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Downloads
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uploaded
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {versions.map((version) => (
            <tr key={version.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-gray-900">
                  v{version.version}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {version.fileName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {(version.fileSize / 1024 / 1024).toFixed(2)} MB
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {version.downloads}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(version.uploadedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {version.uploader.name || version.uploader.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleDelete(version.id, version.version)}
                  disabled={deletingId === version.id}
                  className={`
                    ${
                      deleteConfirm === version.id
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-50 hover:bg-red-100 text-red-700"
                    }
                    px-3 py-1.5 rounded font-medium transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {deletingId === version.id
                    ? "Deleting..."
                    : deleteConfirm === version.id
                    ? "Confirm Delete?"
                    : "Delete"}
                </button>
              </td>
            </tr>
          ))}
          {versions.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No plugin versions uploaded yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
