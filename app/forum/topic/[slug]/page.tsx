import { auth } from "@/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import TopicView from "./TopicView";

async function getTopic(slug: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3001"
      }/api/forum/topics/${slug}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching topic:", error);
    return null;
  }
}

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const session = await auth();
  const data = await getTopic(params.slug);

  if (!data || !data.topic) {
    notFound();
  }

  const { topic, posts, pagination } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/forum" className="hover:text-purple-600">
          Forum
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/forum/category/${topic.category.slug}`}
          className="hover:text-purple-600"
        >
          {topic.category.name}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{topic.title}</span>
      </nav>

      {/* Topic Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
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
        <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            {topic.author.image ? (
              <img
                src={topic.author.image}
                alt={topic.author.name || "User"}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300" />
            )}
            {topic.author.name || "Anonymous"}
          </span>
          <span>•</span>
          <span>{topic.viewCount} views</span>
          <span>•</span>
          <span>{topic.replyCount} replies</span>
        </div>
      </div>

      {/* Topic View Component (Client) */}
      <TopicView
        topic={topic}
        posts={posts}
        pagination={pagination}
        session={session}
      />
    </div>
  );
}
