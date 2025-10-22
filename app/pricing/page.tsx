import { SUBSCRIPTION_PLANS, CREDIT_PACKS } from "@/lib/pricing";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const session = await auth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          Choose the plan that fits your needs. All plans are billed annually
          and include access to our casino and game APIs. These API models
          deliver everything you need to build and maintain your project, and
          included with any subscription is our{" "}
          <Link
            href="/wp-plugin"
            className="text-purple-600 hover:text-purple-700 font-semibold underline"
          >
            WordPress plugin
          </Link>{" "}
          with features beyond most other casino-based plugins.
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Annual Subscriptions
          <span className="block text-lg font-normal text-gray-600 mt-2">
            Per Site - Billed Annually
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                "popular" in plan && plan.popular
                  ? "ring-4 ring-purple-600 transform scale-105"
                  : ""
              }`}
            >
              {"popular" in plan && plan.popular && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.monthlyRate}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ${plan.annualPrice}/year billed annually
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.featureList.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                {session?.user ? (
                  <Link
                    href="/profile/sites/add"
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                      "popular" in plan && plan.popular
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Add Site & Subscribe
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                      "popular" in plan && plan.popular
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radium Credits */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Radium Credits
          <span className="block text-lg font-normal text-gray-600 mt-2">
            Per User - Use across all your sites
          </span>
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Radium Credits power our AI content generation system that creates
          SEO-quality titles, descriptions, and comprehensive reviews for
          casinos and games - complete with FAQs and Pro/Con sections. Generate
          ready-to-publish content instantly, then tweak manually for maximum
          SEO impact. Credits are shared across all your sites.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(CREDIT_PACKS).map((pack) => (
            <div
              key={pack.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                "popular" in pack && pack.popular
                  ? "ring-2 ring-purple-600"
                  : ""
              }`}
            >
              {"popular" in pack && pack.popular && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-600 text-white rounded-full mb-2">
                  Best Value
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {pack.name}
              </h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-purple-600">
                  ${pack.price}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {pack.credits.toLocaleString()} credits
                </div>
                {pack.bonus > 0 && (
                  <div className="text-sm text-green-600 font-semibold mt-1">
                    +{pack.bonus.toLocaleString()} bonus!
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {pack.totalCredits.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">total credits</div>
                <div className="text-xs text-gray-500 mt-1">
                  ${pack.pricePerCredit.toFixed(4)} per credit
                </div>
              </div>
              {session?.user ? (
                <Link
                  href="/profile/credits"
                  className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition ${
                    "popular" in pack && pack.popular
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  Purchase
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block w-full text-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition"
                >
                  Sign In to Buy
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Credit Usage */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          AI-Powered Content Generation
        </h3>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Our unique Radium system uses AI to generate publication-ready content
          for your casino affiliate site. Each piece is SEO-optimized and ready
          to publish - just add your personal touch!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-4xl mb-3">🎰</div>
            <h4 className="font-bold text-gray-900 mb-2">Casino Reviews</h4>
            <p className="text-gray-600 text-sm mb-3">
              Generate complete casino reviews with:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ SEO-optimized title &amp; meta description</li>
              <li>✓ Comprehensive review content</li>
              <li>✓ Pros &amp; Cons sections</li>
              <li>✓ FAQ sections</li>
              <li>✓ Ready to publish immediately</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-4xl mb-3">🎮</div>
            <h4 className="font-bold text-gray-900 mb-2">Game Reviews</h4>
            <p className="text-gray-600 text-sm mb-3">
              Generate complete game reviews with:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ SEO-optimized title &amp; meta description</li>
              <li>✓ Detailed game review content</li>
              <li>✓ Pros &amp; Cons analysis</li>
              <li>✓ FAQ sections</li>
              <li>✓ Ready to publish immediately</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-bold text-purple-900 mb-2">
            💡 Pro Tip: The Winning Formula
          </h4>
          <p className="text-purple-800 text-sm">
            While our AI generates excellent SEO-quality content, manually
            tweaking the generated reviews adds your unique voice and ensures
            even better search engine rankings. Use Radium for speed, add your
            expertise for perfection!
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              How do subscriptions work?
            </h3>
            <p className="text-gray-600">
              Subscriptions are billed annually per site. Each site you add
              requires its own subscription to activate. All plans include a
              free credit bonus to get you started.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              What are Radium Credits?
            </h3>
            <p className="text-gray-600">
              Radium Credits power our unique AI content generation system. Use
              them to instantly generate SEO-optimized casino and game reviews
              complete with titles, descriptions, comprehensive content, FAQs,
              and Pro/Con sections. Credits are tied to your user account and
              work across all your sites. Each generated review is ready to
              publish or can be tweaked for even better results.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Can I change plans later?
            </h3>
            <p className="text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes
              will be prorated based on your billing cycle.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Do credits expire?</h3>
            <p className="text-gray-600">
              No, Radium Credits never expire. Use them at your own pace across
              all your sites.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!session?.user && (
        <div className="mt-16 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Sign up now and get your first site up and running in minutes
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            Create Free Account
          </Link>
        </div>
      )}
    </div>
  );
}
