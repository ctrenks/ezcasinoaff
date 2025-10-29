import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PluginDownloadList from "./PluginDownloadList";

export default async function PluginDownloadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch latest 10 plugin versions
  const versions = await prisma.pluginVersion.findMany({
    take: 10,
    orderBy: { uploadedAt: "desc" },
    include: {
      uploader: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Download Radium Plugin
        </h1>
        <p className="text-lg text-gray-600">
          Download the latest version of the Radium WordPress plugin to
          integrate casino and game data into your site.
        </p>
      </div>

      {versions.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            No plugin versions are available yet. Please check back later.
          </p>
        </div>
      ) : (
        <>
          {/* Latest Version Highlight */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium mb-1">
                  LATEST VERSION
                </p>
                <h2 className="text-3xl font-bold mb-2">
                  Radium Sync v{versions[0].version}
                </h2>
                <p className="text-purple-100 text-sm">
                  Released on{" "}
                  {new Date(versions[0].uploadedAt).toLocaleDateString()}
                </p>
                <p className="text-purple-100 text-sm mt-1">
                  {(versions[0].fileSize / 1024 / 1024).toFixed(2)} MB ·
                  Downloaded {versions[0].downloads} times
                </p>
                {versions[0].description && (
                  <p className="text-purple-200 text-sm mt-2 font-medium">
                    📝 {versions[0].description}
                  </p>
                )}
              </div>
              <a
                href={`/api/plugin/download/${versions[0].id}`}
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-purple-50 transition shadow-lg"
              >
                Download Now
              </a>
            </div>
            {versions[0].changelog && (
              <div className="mt-6 pt-6 border-t border-purple-400">
                <h3 className="font-semibold mb-2">What&apos;s New:</h3>
                <pre className="text-purple-100 text-sm whitespace-pre-wrap font-sans">
                  {versions[0].changelog}
                </pre>
              </div>
            )}
          </div>

          {/* All Versions List */}
          <PluginDownloadList versions={versions} />
        </>
      )}
    </div>
  );
}
