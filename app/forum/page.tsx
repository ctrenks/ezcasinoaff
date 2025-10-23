import { auth } from "@/auth";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/forum-utils";
import { isAdmin } from "@/lib/forum-auth";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  try {
    const categories = await prisma.ez_forum_categories.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { topics: true },
        },
        topics: {
          where: {
            isLocked: false,
          },
          orderBy: {
            lastReplyAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            title: true,
            lastReplyAt: true,
            lastReplyUserId: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return { categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
}

export default async function ForumPage() {
  const session = await auth();
  const { categories } = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
          <p className="text-gray-600 mt-2">
            Discuss casinos, affiliates, games, and more
          </p>
        </div>
        {session?.user && (
          <div className="flex gap-3">
            <Link
              href="/forum/messages"
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition"
            >
              💬 Messages
            </Link>
          </div>
        )}
      </div>

      {/* Sign In Prompt */}
      {!session?.user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-900">
            <Link href="/auth/signin" className="font-semibold underline">
              Sign in
            </Link>{" "}
            to create topics, reply to discussions, and send private messages.
          </p>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p>No forum categories yet.</p>
            {session?.user && isAdmin(session.user.role) && (
              <Link
                href="/forum/admin"
                className="text-purple-600 hover:underline mt-2 inline-block"
              >
                Create the first category
              </Link>
            )}
          </div>
        ) : (
          categories.map((category: any) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <Link href={`/forum/category/${category.slug}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {category.icon && (
                          <span className="text-3xl">{category.icon}</span>
                        )}
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition">
                            {category.name}
                          </h2>
                          {category.description && (
                            <p className="text-gray-600 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">
                          {category._count.topics}
                        </span>{" "}
                        {category._count.topics === 1 ? "topic" : "topics"}
                      </div>
                      {category.topics?.[0] && (
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {category.topics[0].title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            by {category.topics[0].author?.name || "Unknown"} •{" "}
                            {formatRelativeTime(
                              new Date(category.topics[0].lastReplyAt)
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Admin Link */}
      {session?.user && session.user.role === 5 && (
        <div className="mt-8 text-center">
          <Link
            href="/forum/admin"
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ⚙️ Admin Panel
          </Link>
        </div>
      )}
    </div>
  );
}
