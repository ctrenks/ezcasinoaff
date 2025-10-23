"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Recipient {
  id: string;
  name: string | null;
  email: string;
}

interface Props {
  recipient: Recipient | null;
}

export default function ComposeMessageForm({ recipient }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Recipient[]>([]);
  const [formData, setFormData] = useState({
    recipientId: recipient?.id || "",
    subject: "",
    content: "",
  });

  useEffect(() => {
    // Fetch users for recipient selection
    if (!recipient) {
      fetchUsers();
    }
  }, [recipient]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/forum/users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipientId || !formData.subject || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/forum/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: formData.recipientId,
          subject: formData.subject,
          content: formData.content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      toast.success("Message sent successfully!");
      router.push("/forum/messages");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 space-y-6"
    >
      {/* Recipient */}
      <div>
        <label
          htmlFor="recipient"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          To
        </label>
        {recipient ? (
          <div className="px-4 py-3 bg-gray-100 rounded-lg">
            <p className="font-medium">{recipient.name || "Anonymous"}</p>
            <p className="text-sm text-gray-600">{recipient.email}</p>
          </div>
        ) : (
          <select
            id="recipient"
            value={formData.recipientId}
            onChange={(e) =>
              setFormData({ ...formData, recipientId: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            required
          >
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || "Anonymous"} ({user.email})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          placeholder="Enter message subject"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
          placeholder="Type your message..."
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
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
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
