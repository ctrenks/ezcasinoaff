import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WebmasterProfile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch user's sites
  const sites = await prisma.site.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subscription: {
        select: {
          plan: true,
          status: true,
          endDate: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch user's affiliate info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      referralCode: true,
      commissionRate: true,
      _count: {
        select: {
          referrals: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Affiliate Program Section */}
      <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">💰 Affiliate Program</h2>
            <p className="text-sm opacity-90 mb-4">
              You&apos;re on a{" "}
              <strong>{Number(user?.commissionRate || 15)}%</strong> revshare
              deal
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="opacity-75">Total Referrals:</span>{" "}
                <strong>{user?._count.referrals || 0}</strong>
              </div>
              {user?.referralCode && (
                <div className="bg-white/20 px-3 py-1 rounded">
                  <span className="opacity-75">Code:</span>{" "}
                  <strong>{user.referralCode}</strong>
                </div>
              )}
            </div>
          </div>
          <Link
            href="/profile/affiliates"
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Dashboard →
          </Link>
        </div>
      </div>

      {/* Sites Overview Section */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Sites</h2>
            <p className="text-sm text-gray-600">
              {sites.length} {sites.length === 1 ? "site" : "sites"} registered
            </p>
          </div>
          <Link
            href="/profile/sites/add"
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
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

        {sites.length > 0 ? (
          <div className="space-y-3">
            {sites.slice(0, 3).map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {site.name || site.domain}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        site.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {site.status}
                    </span>
                    {site.subscription && (
                      <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                        {site.subscription.plan}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{site.domain}</p>
                </div>
                <Link
                  href={`/profile/sites/${site.id}`}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View Details →
                </Link>
              </div>
            ))}
            {sites.length > 3 && (
              <Link
                href="/profile/sites"
                className="block text-center text-purple-600 hover:text-purple-700 font-medium text-sm pt-2"
              >
                View all {sites.length} sites →
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🌐</div>
            <p className="text-gray-600 mb-4">No sites added yet</p>
            <Link
              href="/profile/sites/add"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Add Your First Site
            </Link>
          </div>
        )}
      </div>

      {/* Profile Form Section */}
      <ProfileForm user={session.user} />
    </div>
  );
}
