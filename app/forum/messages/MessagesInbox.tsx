"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/forum-utils";
import toast from "react-hot-toast";

export default function MessagesInbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/forum/messages");
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data.messages);
      setUnreadCount(data.unreadCount);
    } catch (error: any) {
      toast.error(error.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await fetch(`/api/forum/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete message");

      toast.success("Message deleted");
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete message");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {unreadCount > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-900">
            You have <span className="font-semibold">{unreadCount}</span> unread{" "}
            {unreadCount === 1 ? "message" : "messages"}
          </p>
        </div>
      )}

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No messages yet.</p>
            <p className="text-sm mt-2">
              You&apos;ll see private messages from other users here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-gray-50 transition ${
                  !message.isRead ? "bg-purple-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <Link
                    href={`/forum/messages/${message.id}`}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {message.sender.image ? (
                        <img
                          src={message.sender.image}
                          alt={message.sender.name || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {message.sender.name || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatRelativeTime(new Date(message.createdAt))}
                        </div>
                      </div>
                      {!message.isRead && (
                        <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {message.subject}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {message.content.replace(/<[^>]*>/g, "")}
                    </p>
                    {message.recipients.length > 0 && (
                      <div className="mt-2 text-sm text-gray-500">
                        To:{" "}
                        {message.recipients.map((r: any) => r.name).join(", ")}
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <div className="text-center text-sm text-gray-500">
        <p>
          To send a new message, visit a user&apos;s profile from the forum and
          click &quot;Send Message&quot;
        </p>
      </div>
    </div>
  );
}
