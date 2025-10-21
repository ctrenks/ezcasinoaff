import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
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
        <div className="webmaster-portal">
          {/* Header */}
          <header className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-4">
                  <Link href="/">
                    <Logo className="h-10 w-auto" />
                  </Link>
                  <span className="text-purple-300 text-sm">
                    Webmaster Portal
                  </span>
                </div>

                <nav className="flex items-center space-x-6">
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
                  {session?.user ? (
                    <>
                      <Link
                        href="/games"
                        className="hover:text-purple-300 transition"
                      >
                        Games
                      </Link>
                      <Link
                        href="/profile"
                        className="hover:text-purple-300 transition"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/api/auth/signout"
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
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
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-screen bg-gray-50">{children}</main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} EZ Casino Affiliates. All rights
                reserved.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Making casino affiliate marketing easy
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
