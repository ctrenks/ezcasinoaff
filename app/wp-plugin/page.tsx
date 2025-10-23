import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function WPPluginPage() {
  const session = await auth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
          WordPress Plugin
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          EZ Casino Affiliates WordPress Plugin
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The most powerful WordPress plugin for casino affiliates. Included
          free with any subscription plan.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-12 text-white mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Beyond Any Other Casino Plugin
            </h2>
            <p className="text-purple-100 mb-6">
              Built specifically for casino affiliates, our WordPress plugin
              integrates seamlessly with our API to deliver dynamic content,
              automated updates, and powerful features that go far beyond
              standard casino plugins.
            </p>
            <div className="flex gap-4">
              {session?.user ? (
                <Link
                  href="/profile/sites"
                  className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Get Plugin
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Sign Up to Access
                </Link>
              )}
              <Link
                href="/pricing"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
              >
                View Pricing
              </Link>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-8 backdrop-blur">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="font-semibold">350+ Casino Integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="font-semibold">
                  Over 20,000 games w/ Slotslaunch integration
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="font-semibold">Over 250,000 Images</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="font-semibold">Auto-Updates via API</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="font-semibold">Gaming Content Generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Casino Management
            </h3>
            <p className="text-gray-600">
              Display casino listings with ratings, reviews, bonuses, and
              affiliate links. Access our database of 350+ casinos or add your
              own custom casinos with full control.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Game Library
            </h3>
            <p className="text-gray-600">
              Access over 20,000 casino games with Slotslaunch integration.
              Includes thumbnails, descriptions, and playable demos (with valid
              Slotslaunch account). Create game pages automatically with
              shortcodes.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Gaming Content Generation
            </h3>
            <p className="text-gray-600">
              Generate professional casino and game reviews with SEO-optimized
              titles, descriptions, Pro/Con sections, and FAQs using Radium
              Credits. Perfect for scaling your content.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Auto-Sync Updates
            </h3>
            <p className="text-gray-600">
              Casino bonuses, game releases, and database updates sync
              automatically via API. Your content stays fresh without manual
              work.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Geo-Targeting
            </h3>
            <p className="text-gray-600">
              Show or hide casinos based on visitor location. Display
              geo-appropriate content with built-in restriction management.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Advanced Shortcodes
            </h3>
            <p className="text-gray-600">
              Powerful shortcodes for casino lists, game grids, comparison
              tables, top picks, and more. Includes an intuitive UI wizard to
              create and customize shortcodes without coding.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Bonus Management
            </h3>
            <p className="text-gray-600">
              Display casino bonuses, promotions, and exclusive offers.
              Everything plan includes unified bonus code feed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Banking Information
            </h3>
            <p className="text-gray-600">
              Show payment methods, withdrawal times, and banking details for
              each casino. Build trust with comprehensive financial info.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Custom Templates
            </h3>
            <p className="text-gray-600">
              Pre-built templates for casino pages, game pages, and review
              layouts. Fully customizable with your branding and style.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Add Custom Casinos
            </h3>
            <p className="text-gray-600">
              Not just limited to our database! Add your own custom casinos,
              manage exclusive deals, and maintain complete control over your
              casino listings.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Shortcode Wizard
            </h3>
            <p className="text-gray-600">
              Visual interface to build shortcodes without touching code. Select
              options, customize settings, and generate ready-to-use shortcodes
              instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Free Trial Notice */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 mb-16">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-green-600 text-white rounded-full text-sm font-bold mb-4">
            🎉 FREE TO TRY
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Test Drive with a Free Demo API Key
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-4">
            Get a free demo API key instantly when you register! Experiment with
            the plugin and API access before committing to a subscription.
            Perfect for testing integration and exploring features.
          </p>
          {!session?.user && (
            <Link
              href="/auth/signin"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Get Free Demo Key →
            </Link>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Subscribe</h3>
            <p className="text-gray-600 text-sm">
              Choose any plan starting at $25/month (billed annually)
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Add Your Site</h3>
            <p className="text-gray-600 text-sm">
              Register your WordPress site and get your unique API key
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Install Plugin</h3>
            <p className="text-gray-600 text-sm">
              Download and install the plugin, enter your API key
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Go Live</h3>
            <p className="text-gray-600 text-sm">
              Start publishing casino and game content immediately
            </p>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Available with All Plans
        </h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Basic
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-purple-50">
                  Pro
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Everything
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  WordPress Plugin
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
                <td className="px-6 py-4 text-center text-green-600 bg-purple-50">
                  ✓
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  350+ Casino Database
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
                <td className="px-6 py-4 text-center text-green-600 bg-purple-50">
                  ✓
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Over 20,000 Games (Slotslaunch)
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
                <td className="px-6 py-4 text-center text-green-600 bg-purple-50">
                  ✓
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Geo-Targeting
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
                <td className="px-6 py-4 text-center text-green-600 bg-purple-50">
                  ✓
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Game Screenshots
                </td>
                <td className="px-6 py-4 text-center text-gray-400">—</td>
                <td className="px-6 py-4 text-center text-green-600 bg-purple-50">
                  ✓
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Bonus Code Feed
                </td>
                <td className="px-6 py-4 text-center text-gray-400">—</td>
                <td className="px-6 py-4 text-center text-gray-400 bg-purple-50">
                  —
                </td>
                <td className="px-6 py-4 text-center text-green-600">✓</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Radium Credits/Month
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  10
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">
                  25
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  50
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Casino Affiliate Site?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Get access to our powerful WordPress plugin with any subscription
          plan. Start building your casino affiliate empire today.
        </p>
        <div className="flex gap-4 justify-center">
          {session?.user ? (
            <>
              <Link
                href="/profile/sites/add"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
              >
                Add Your Site
              </Link>
              <Link
                href="/pricing"
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition"
              >
                View Plans
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
              >
                Get Started Now
              </Link>
              <Link
                href="/pricing"
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition"
              >
                View Pricing
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
