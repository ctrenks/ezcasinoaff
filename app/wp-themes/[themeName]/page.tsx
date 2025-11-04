import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ThemePageProps {
  params: {
    themeName: string;
  };
}

export async function generateMetadata({ params }: ThemePageProps) {
  const decodedThemeName = decodeURIComponent(params.themeName);

  return {
    title: `${decodedThemeName} - WordPress Theme Versions`,
    description: `Download all versions of ${decodedThemeName} WordPress theme`,
  };
}

export default async function ThemeVersionsPage({ params }: ThemePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const decodedThemeName = decodeURIComponent(params.themeName);

  // Fetch all versions of this theme
  const versions = await prisma.themeVersion.findMany({
    where: { themeName: decodedThemeName },
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

  if (versions.length === 0) {
    notFound();
  }

  const latestVersion = versions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/wp-themes"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-4"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to All Themes
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {decodedThemeName}
        </h1>
        <p className="text-lg text-gray-600">
          Download any version of the {decodedThemeName} WordPress theme.
        </p>
      </div>

      {/* Latest Version Highlight */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1">
              LATEST VERSION
            </p>
            <h2 className="text-3xl font-bold mb-2">
              {decodedThemeName} v{latestVersion.version}
            </h2>
            <p className="text-purple-100 text-sm">
              Released on{" "}
              {new Date(latestVersion.uploadedAt).toLocaleDateString()}
            </p>
            <p className="text-purple-100 text-sm mt-1">
              {(latestVersion.fileSize / 1024 / 1024).toFixed(2)} MB ·
              Downloaded {latestVersion.downloads} times
            </p>
            {latestVersion.description && (
              <p className="text-purple-200 text-sm mt-2 font-medium">
                📝 {latestVersion.description}
              </p>
            )}
          </div>
          <a
            href={`/api/theme/download/${latestVersion.id}`}
            className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-purple-50 transition shadow-lg"
          >
            Download Now
          </a>
        </div>
        {latestVersion.changelog && (
          <div className="mt-6 pt-6 border-t border-purple-400">
            <h3 className="font-semibold mb-2">What&apos;s New:</h3>
            <pre className="text-purple-100 text-sm whitespace-pre-wrap font-sans">
              {latestVersion.changelog}
            </pre>
          </div>
        )}
      </div>

      {/* All Versions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">All Versions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {versions.map((version) => (
            <div key={version.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      v{version.version}
                    </h3>
                    {version.id === latestVersion.id && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Latest
                      </span>
                    )}
                  </div>
                  {version.description && (
                    <p className="text-gray-700 mb-2">{version.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {new Date(version.uploadedAt).toLocaleDateString()}
                    </span>
                    <span>
                      {(version.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span>{version.downloads} downloads</span>
                  </div>
                  {version.changelog && (
                    <div className="mt-3 bg-gray-50 rounded p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Changelog:
                      </p>
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
                        {version.changelog}
                      </pre>
                    </div>
                  )}
                </div>
                <a
                  href={`/api/theme/download/${version.id}`}
                  className="ml-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
