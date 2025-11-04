import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ThemesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get all unique themes with their latest version
  const allVersions = await prisma.themeVersion.findMany({
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

  // Group by theme name and get latest version for each
  const themesMap = new Map();
  allVersions.forEach((version) => {
    if (!themesMap.has(version.themeName)) {
      themesMap.set(version.themeName, version);
    }
  });

  const themes = Array.from(themesMap.values());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          WordPress Themes
        </h1>
        <p className="text-lg text-gray-600">
          Download professional WordPress themes designed for casino affiliate
          sites.
        </p>
      </div>

      {themes.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            No themes are available yet. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              href={`/wp-themes/${encodeURIComponent(theme.themeName)}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                <div className="text-6xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold mb-2">{theme.themeName}</h2>
                <p className="text-purple-100 text-sm">
                  Latest Version: v{theme.version}
                </p>
              </div>
              <div className="p-6">
                {theme.description && (
                  <p className="text-gray-700 mb-4">{theme.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{(theme.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  <span>{theme.downloads} downloads</span>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                    View All Versions
                    <svg
                      className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Back to Plugin */}
      <div className="mt-12 text-center">
        <Link
          href="/wp-plugin"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
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
          Back to WP Plugin
        </Link>
      </div>
    </div>
  );
}
