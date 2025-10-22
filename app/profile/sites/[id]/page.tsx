import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SiteDetailsClient from "./SiteDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SiteDetailsPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch site details
  const site = await prisma.site.findFirst({
    where: {
      id: params.id,
      userId: session.user.id, // Ensure user owns this site
    },
    include: {
      subscription: {
        include: {
          payments: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
        },
      },
      apiUsage: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      radiumUsage: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!site) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Site Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This site doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Link
            href="/profile/sites"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to My Sites
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/profile/sites"
          className="text-purple-600 hover:text-purple-700 font-medium mb-4 inline-block"
        >
          ← Back to My Sites
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {site.name || site.domain}
            </h1>
            <p className="text-gray-600">{site.domain}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                site.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {site.status}
            </span>
            {site.subscription && (
              <span className="px-4 py-2 text-sm font-semibold bg-purple-100 text-purple-800 rounded-full">
                {site.subscription.plan}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <SiteDetailsClient site={site} />
    </div>
  );
}
