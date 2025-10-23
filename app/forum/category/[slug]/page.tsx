import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRelativeTime } from "@/lib/forum-utils";

async function getCategory(slug: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3001"
      }/api/forum/categories`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.categories.find((c: any) => c.slug === slug);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getTopics(categoryId: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3001"
      }/api/forum/topics?categoryId=${categoryId}`,
      { cache: "no-store" }
    );
    if (!response.ok) return { topics: [], pagination: {} };
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    return { topics: [], pagination: {} };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const { topics } = await getTopics(category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/forum" className="hover:text-purple-600">
          Forum
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>
        {session?.user && (
          <Link
            href={`/forum/new-topic?category=${category.id}`}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            + New Topic
          </Link>
        )}
      </div>

      {/* Sign In Prompt */}
      {!session?.user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-900">
            <Link href="/auth/signin" className="font-semibold underline">
              Sign in
            </Link>{" "}
            to create a new topic or reply to existing ones.
          </p>
        </div>
      )}

      {/* Topics List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {topics.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No topics yet.</p>
            {session?.user && (
              <Link
                href={`/forum/new-topic?category=${category.id}`}
                className="text-purple-600 hover:underline mt-2 inline-block"
              >
                Be the first to start a discussion!
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {topics.map((topic: any) => (
              <Link
                key={topic.id}
                href={`/forum/topic/${topic.slug}`}
                className="block hover:bg-gray-50 transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {topic.isPinned && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                            📌 PINNED
                          </span>
                        )}
                        {topic.isLocked && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold">
                            🔒 LOCKED
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          {topic.author.image ? (
                            <img
                              src={topic.author.image}
                              alt={topic.author.name || "User"}
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-300" />
                          )}
                          {topic.author.name || "Anonymous"}
                        </span>
                        <span>•</span>
                        <span>
                          {formatRelativeTime(new Date(topic.createdAt))}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {topic._count.posts} replies
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {topic.viewCount} views
                      </div>
                      {topic.lastReplyAt && (
                        <div className="text-xs text-gray-600 mt-2">
                          Last reply{" "}
                          {formatRelativeTime(new Date(topic.lastReplyAt))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
