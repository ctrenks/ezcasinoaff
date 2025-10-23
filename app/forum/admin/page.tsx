import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminCategoriesManager from "./AdminCategoriesManager";

export default async function ForumAdminPage() {
  const session = await auth();

  // Check if user is admin (role 1 or 0)
  if (!session?.user || (session.user.role !== 1 && session.user.role !== 0)) {
    redirect("/forum");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Forum Administration
          </h1>
          <p className="text-gray-600 mt-2">
            Manage forum categories, topics, and posts
          </p>
        </div>
        <Link
          href="/forum"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back to Forum
        </Link>
      </div>

      <AdminCategoriesManager />
    </div>
  );
}
