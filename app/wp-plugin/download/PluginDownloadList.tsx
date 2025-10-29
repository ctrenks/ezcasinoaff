"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface PluginVersion {
  id: string;
  version: string;
  fileName: string;
  fileSize: number;
  description: string | null;
  changelog: string | null;
  uploadedAt: Date;
  downloads: number;
  uploader: {
    name: string | null;
    email: string;
  };
}

interface Props {
  versions: PluginVersion[];
}

export default function PluginDownloadList({ versions }: Props) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">All Versions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Previous releases and changelog history
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {versions.map((version) => (
          <div
            key={version.id}
            className="px-6 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    v{version.version}
                  </h3>
                  {version.description && (
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                      {version.description}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(version.uploadedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>📦 {version.fileName}</span>
                  <span>
                    💾 {(version.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <span>⬇️ {version.downloads} downloads</span>
                </div>

                {version.changelog && (
                  <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-900 mb-1">
                      Changelog:
                    </p>
                    <pre className="whitespace-pre-wrap font-sans">
                      {version.changelog}
                    </pre>
                  </div>
                )}
              </div>

              <a
                href={`/api/plugin/download/${version.id}`}
                className="ml-6 flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-sm"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
