"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/forum-utils";
import toast from "react-hot-toast";

interface TopicViewProps {
  topic: any;
  posts: any[];
  pagination: any;
  session: any;
}

export default function TopicView({
  topic,
  posts,
  pagination,
  session,
}: TopicViewProps) {
  const router = useRouter();
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: topic.id,
          content: replyContent,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to post reply");
      }

      toast.success("Reply posted successfully!");
      setReplyContent("");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post: any, index: number) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="flex">
              {/* Author Info */}
              <div className="w-48 bg-gray-50 p-4 border-r border-gray-200">
                <div className="text-center">
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.name || "User"}
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2" />
                  )}
                  <div className="font-semibold text-gray-900">
                    {post.author.name || "Anonymous"}
                  </div>
                  {post.author.role === 5 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded mt-2 inline-block">
                      Super Admin
                    </span>
                  )}
                  {session?.user && session.user.id !== post.author.id && (
                    <Link
                      href={`/forum/messages/compose?to=${post.author.id}`}
                      className="mt-3 text-xs bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 transition inline-block"
                    >
                      📧 Send PM
                    </Link>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-gray-500">
                    {formatRelativeTime(new Date(post.createdAt))}
                    {post.isEdited && (
                      <span className="ml-2 text-xs text-gray-400">
                        (edited)
                      </span>
                    )}
                  </div>
                  {session?.user &&
                    (session.user.id === post.author.id ||
                      session.user.role === 5) && (
                      <div className="flex gap-2">
                        <button
                          className="text-xs text-purple-600 hover:underline"
                          onClick={() => {
                            // TODO: Implement edit functionality
                            toast("Edit functionality coming soon!");
                          }}
                        >
                          Edit
                        </button>
                        {index !== 0 && (
                          <button
                            className="text-xs text-red-600 hover:underline"
                            onClick={() => {
                              // TODO: Implement delete functionality
                              toast("Delete functionality coming soon!");
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                </div>

                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {post.attachments.map((attachment: any) => (
                      <div key={attachment.id}>
                        {attachment.mimeType.startsWith("image/") ? (
                          <img
                            src={attachment.url}
                            alt={attachment.filename}
                            className="max-w-full rounded-lg"
                            style={{ maxHeight: "400px" }}
                          />
                        ) : (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            📎 {attachment.filename}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {session?.user ? (
        topic.isLocked ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-900">
              🔒 This topic is locked and cannot accept new replies.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Post a Reply
            </h3>
            <form onSubmit={handleReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={6}
                placeholder="Write your reply here..."
                disabled={isSubmitting}
              />
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  You can use HTML formatting and embed YouTube/Twitter links
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </button>
              </div>
            </form>
          </div>
        )
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <Link href="/auth/signin" className="font-semibold underline">
              Sign in
            </Link>{" "}
            to reply to this topic.
          </p>
        </div>
      )}
    </div>
  );
}
