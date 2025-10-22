import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SitesList from "./SitesList";

export const dynamic = "force-dynamic";

export default async function SitesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sites</h1>
          <p className="text-gray-600">Manage your sites and API access</p>
        </div>
        <Link
          href="/profile/sites/add"
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Site
        </Link>
      </div>

      <SitesList />
    </div>
  );
}
