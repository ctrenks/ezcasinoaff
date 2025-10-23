"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  messageId: string;
  originalSubject: string;
  senderId: string;
}

export default function ReplyToMessage({
  messageId,
  originalSubject,
  senderId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);

    try {
      // Send reply as a new message
      const response = await fetch("/api/forum/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: senderId,
          subject: originalSubject.startsWith("Re:")
            ? originalSubject
            : `Re: ${originalSubject}`,
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send reply");
      }

      toast.success("Reply sent successfully!");
      setContent("");
      setShowForm(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          ✍️ Quick Reply
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Reply</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="reply-content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Reply
          </label>
          <textarea
            id="reply-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
            placeholder="Type your reply..."
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setContent("");
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
