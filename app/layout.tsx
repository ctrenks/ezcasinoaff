import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import NotificationBell from "@/components/NotificationBell";
import ReferralTracker from "@/components/ReferralTracker";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "EZ Casino Affiliates - Casino Affiliate Portal",
  description: "Your gateway to casino affiliate programs and gaming content",
};

export default async function WebmasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <ReferralTracker />
          <div className="webmaster-portal">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Row 1: Logo + Primary Navigation */}
                <div className="flex justify-between items-center py-3 border-b border-purple-700/30">
                  <Link href="/" className="flex items-center gap-3">
                    <Logo className="h-10 w-auto" />
                    <span className="text-lg font-bold text-white">
                      EZ Casino Affiliates
                    </span>
                  </Link>

                  <nav className="hidden lg:flex items-center space-x-6">
                    <Link href="/" className="hover:text-purple-300 transition">
                      Home
                    </Link>
                    <Link
                      href="/casinos"
                      className="hover:text-purple-300 transition"
                    >
                      Casinos
                    </Link>
                    <Link
                      href="/affiliates"
                      className="hover:text-purple-300 transition"
                    >
                      Affiliate Programs
                    </Link>
                    <Link
                      href="/forum"
                      className="hover:text-purple-300 transition"
                    >
                      Forum
                    </Link>
                    <Link
                      href="/casino-operators"
                      className="hover:text-orange-300 transition text-orange-400"
                    >
                      Casino Operators
                    </Link>
                    <Link
                      href="/wp-plugin"
                      className="hover:text-purple-300 transition"
                    >
                      WP Plugin
                    </Link>
                    <Link
                      href="/pricing"
                      className="hover:text-purple-300 transition"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/contact"
                      className="hover:text-purple-300 transition"
                    >
                      Contact
                    </Link>
                  </nav>

                  {/* Mobile hamburger */}
                  <div className="lg:hidden">
                    <Navigation session={session} />
                  </div>
                </div>

                {/* Row 2: User Navigation (Desktop Only) */}
                <div className="hidden lg:flex justify-end items-center py-2.5 space-x-6 text-sm">
                  {session?.user ? (
                    <>
                      <NotificationBell />
                      {session.user.role === 5 && (
                        <Link
                          href="/admin"
                          className="hover:text-orange-300 transition flex items-center gap-1 text-orange-400 font-semibold"
                        >
                          <span>🛡️</span> Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile/affiliates"
                        className="hover:text-purple-300 transition flex items-center gap-1"
                      >
                        <span>💰</span> Affiliates
                      </Link>
                      <Link
                        href="/profile/sites"
                        className="hover:text-purple-300 transition flex items-center gap-1"
                      >
                        <span>🏢</span> My Sites
                      </Link>
                      <Link
                        href="/profile/credits"
                        className="hover:text-purple-300 transition flex items-center gap-1"
                      >
                        <span>🤖</span> Radium Credits
                      </Link>
                      <Link
                        href="/profile/ez-credits"
                        className="hover:text-purple-300 transition flex items-center gap-1"
                      >
                        <span>💎</span> EZ Credits
                      </Link>
                      <Link
                        href="/profile"
                        className="hover:text-purple-300 transition flex items-center gap-1"
                      >
                        <span>👤</span> Profile
                      </Link>
                      <Link
                        href="/api/auth/signout"
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded transition font-medium"
                      >
                        Sign Out
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/signin"
                        className="hover:text-purple-300 transition"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signin"
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded transition font-medium"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="min-h-screen bg-gray-50">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex space-x-6 text-sm">
                    <Link
                      href="/contact"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/terms"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                  <p className="text-gray-400">
                    © {new Date().getFullYear()} EZ Casino Affiliates. All
                    rights reserved.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Making casino affiliate marketing easy
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
