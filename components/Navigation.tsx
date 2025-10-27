"use client";

import { useState } from "react";
import Link from "next/link";
import { Session } from "next-auth";

interface NavigationProps {
  session: Session | null;
}

export default function Navigation({ session }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-6">
        <Link href="/" className="hover:text-purple-300 transition">
          Home
        </Link>
        <Link href="/casinos" className="hover:text-purple-300 transition">
          Casinos
        </Link>
        <Link href="/affiliates" className="hover:text-purple-300 transition">
          Affiliate Programs
        </Link>
        <Link href="/forum" className="hover:text-purple-300 transition">
          Forum
        </Link>
        <Link
          href="/casino-operators"
          className="hover:text-orange-300 transition text-orange-400"
        >
          Casino Operators
        </Link>
        <Link href="/wp-plugin" className="hover:text-purple-300 transition">
          WP Plugin
        </Link>
        <Link href="/pricing" className="hover:text-purple-300 transition">
          Pricing
        </Link>
        {session?.user ? (
          <>
            <Link
              href="/profile/sites"
              className="hover:text-purple-300 transition"
            >
              My Sites
            </Link>
            <Link
              href="/profile/credits"
              className="hover:text-purple-300 transition"
            >
              Credits
            </Link>
            <Link href="/profile" className="hover:text-purple-300 transition">
              Profile
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

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden text-white p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center px-4 py-4 border-b border-purple-700">
              <span className="text-white text-lg font-bold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-2"
                aria-label="Close menu"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                >
                  Home
                </Link>
                <Link
                  href="/casinos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                >
                  Casinos
                </Link>
                <Link
                  href="/affiliates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                >
                  Affiliate Programs
                </Link>
                <Link
                  href="/forum"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                >
                  Forum
                </Link>
                <Link
                  href="/casino-operators"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-orange-400 text-xl py-3 px-4 rounded-lg hover:bg-orange-900 transition"
                >
                  Casino Operators
                </Link>
                <Link
                  href="/wp-plugin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                >
                  WP Plugin
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                >
                  Pricing
                </Link>

                {session?.user ? (
                  <>
                    <div className="border-t border-purple-700 my-4 pt-4">
                      <p className="text-purple-300 text-sm px-4 mb-2">
                        My Account
                      </p>
                    </div>
                    <Link
                      href="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                    >
                      🔔 Notifications
                    </Link>
                    <Link
                      href="/profile/sites"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                    >
                      My Sites
                    </Link>
                    <Link
                      href="/profile/credits"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                    >
                      Credits
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-white text-xl py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition mt-4 text-center font-semibold"
                    >
                      Sign Out
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="border-t border-purple-700 my-4 pt-4"></div>
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-white text-xl py-3 px-4 rounded-lg hover:bg-purple-800 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-white text-xl py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-center font-semibold"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
