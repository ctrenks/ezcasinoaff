import { auth } from "@/auth";
import Link from "next/link";
import DashboardStats from "./DashboardStats";

export const dynamic = "force-dynamic";

export default async function WebmasterDashboard() {
  const session = await auth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        {session?.user ? (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {session.user.name || "Webmaster"}!
            </h1>
            <p className="text-xl text-gray-600">
              Your affiliate dashboard for casino gaming content
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to EZ Casino Affiliates
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Making casino affiliate marketing easy - Your gateway to casino
              affiliate programs and gaming content
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth/signin"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg font-semibold transition"
              >
                View Pricing
              </Link>
              <Link
                href="/casinos"
                className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 py-3 rounded-lg font-semibold transition"
              >
                Browse Casinos
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Quick Stats */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/casinos"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <div className="text-4xl mb-4">🎰</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Browse Casinos
          </h3>
          <p className="text-gray-600">
            Explore approved casino brands and get affiliate links
          </p>
        </Link>

        {session?.user && (
          <Link
            href="/games"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Demo Games</h3>
            <p className="text-gray-600">
              Access 200+ slots with playable demos
            </p>
          </Link>
        )}

        <Link
          href="/affiliates"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Affiliate Programs
          </h3>
          <p className="text-gray-600">
            Join casino affiliate programs and earn commissions
          </p>
        </Link>

        <Link
          href="/pricing"
          className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1 text-white"
        >
          <div className="text-4xl mb-4">💎</div>
          <h3 className="text-xl font-bold mb-2">View Pricing</h3>
          <p className="text-purple-100">
            Plans starting at $25/month • Pay annually
          </p>
        </Link>

        {session?.user && (
          <>
            <Link
              href="/profile/sites"
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">My Sites</h3>
              <p className="text-gray-600">Manage your sites and API keys</p>
            </Link>

            <Link
              href="/profile/credits"
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Radium Credits
              </h3>
              <p className="text-gray-600">
                Purchase and manage your credit balance
              </p>
            </Link>

            <Link
              href="/profile"
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                My Profile
              </h3>
              <p className="text-gray-600">
                Update your profile and contact information
              </p>
            </Link>

            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-md p-8 text-white">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">API Access</h3>
              <p className="text-purple-100">
                Get your API key to integrate casino data
              </p>
              <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition">
                View API Docs
              </button>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg shadow-md p-8 text-white">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Resources</h3>
              <p className="text-pink-100">
                Marketing materials, banners, and guides
              </p>
              <button className="mt-4 bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-pink-50 transition">
                Browse Resources
              </button>
            </div>
          </>
        )}
      </div>

      {/* Getting Started Guide */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Getting Started
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 font-bold mr-4">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {session?.user ? "Complete Your Profile" : "Sign Up or Sign In"}
              </h4>
              <p className="text-gray-600">
                {session?.user
                  ? "Add your contact information and website details"
                  : "Create an account to access all features"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 font-bold mr-4">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Browse Casinos & Games
              </h4>
              <p className="text-gray-600">
                Explore our curated selection of casino brands and games
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 font-bold mr-4">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Join Affiliate Programs
              </h4>
              <p className="text-gray-600">
                Sign up for programs and start promoting
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 font-bold mr-4">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Integrate with API
              </h4>
              <p className="text-gray-600">
                Use our API to display casino data on your website
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
