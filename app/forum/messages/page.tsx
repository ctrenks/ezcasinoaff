import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import MessagesInbox from "./MessagesInbox";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Private Messages</h1>
          <p className="text-gray-600 mt-2">
            Send and receive private messages with other forum members
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/forum/messages/compose"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            ✍️ Compose
          </Link>
          <Link
            href="/forum"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Forum
          </Link>
        </div>
      </div>

      <MessagesInbox />
    </div>
  );
}
