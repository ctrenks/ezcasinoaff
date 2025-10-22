import Link from "next/link";

export default function CasinoOperatorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
          FOR CASINO OPERATORS
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Reach Every Affiliate.
          <br />
          <span className="text-purple-600">Control Your Brand.</span>
        </h1>
        <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
          Get direct access to all EZ Casino Affiliate users. Update your casino
          information once, and see it reflected across hundreds of affiliate
          sites within an hour.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://www.allmedidamatter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
          >
            Access Operator Portal →
          </a>
          <Link
            href="#how-it-works"
            className="inline-block border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-16 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">Instant</div>
            <div className="text-orange-100">
              Updates pushed to all sites within 1 hour
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">Hundreds</div>
            <div className="text-orange-100">
              Of affiliate sites using our network
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">One Click</div>
            <div className="text-orange-100">
              Deploy new casinos across the entire network
            </div>
          </div>
        </div>
      </div>

      {/* The Problem/Solution */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-red-600 font-bold text-sm mb-2">
              THE OLD WAY
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Scattered, Outdated, Frustrating
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>
                  Contact hundreds of affiliates individually for updates
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Wait weeks for your information to be updated</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Outdated bonuses and promotions on affiliate sites</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>No control over how your brand is presented</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Miss out on new affiliate sites launching</span>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-green-600 font-bold text-sm mb-2">
              THE EZ WAY
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Centralized, Instant, Powerful
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Update once, reach all affiliates within 1 hour</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Control your brand presentation from one portal</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  Get notified of added software, banking realtime to keep your
                  brands updated
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  Automatic notifications to affiliates about new properties
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Get new affiliate sign ups and onboard same day</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="bg-gray-50 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          How It Works - Simple & Powerful
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Sign In</h3>
            <p className="text-gray-600 text-sm">
              Access the operator portal and create your account
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Add Your Program</h3>
            <p className="text-gray-600 text-sm">
              Register your affiliate program with all necessary details
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Manage Casinos</h3>
            <p className="text-gray-600 text-sm">
              Add casinos, bonuses, games, banking info - everything you need
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Go Live</h3>
            <p className="text-gray-600 text-sm">
              Changes push to all affiliate sites within 1 hour automatically
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Everything You Need to Control Your Brand
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Casino Management
            </h3>
            <p className="text-gray-600">
              Add and manage unlimited casino properties under your affiliate
              program. Full control over branding, descriptions, and features.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Instant Updates
            </h3>
            <p className="text-gray-600">
              Make changes and see them reflected across hundreds of affiliate
              sites within an hour. No waiting, no manual updates needed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Bonus Management
            </h3>
            <p className="text-gray-600">
              Update bonuses, promotions, and exclusive offers in real-time.
              Keep your offers fresh across the entire affiliate network.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Software Integration
            </h3>
            <p className="text-gray-600">
              Add new game providers and software. Your game library updates
              automatically across all sites using EZ Casino Aff.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Affiliate Notifications
            </h3>
            <p className="text-gray-600">
              When you add a new property, all affiliates are automatically
              notified. Deploy new casinos with maximum reach instantly.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Complete Information
            </h3>
            <p className="text-gray-600">
              Banking details, geo-restrictions, licenses, payment methods -
              provide everything affiliates need to promote effectively.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Multi-Program Support
            </h3>
            <p className="text-gray-600">
              Manage multiple affiliate programs from one dashboard. Perfect for
              operators with diverse brand portfolios.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Image Management
            </h3>
            <p className="text-gray-600">
              Upload logos, banners, screenshots, and promotional materials.
              Control your visual brand presence everywhere.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Geo-Restrictions
            </h3>
            <p className="text-gray-600">
              Set country restrictions and licensing info. Affiliates can filter
              by region and show only appropriate casinos.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Casino Operators Choose EZ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              →
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Maximum Affiliate Reach
              </h3>
              <p className="text-gray-700">
                Your casino information reaches every affiliate site in our
                network instantly. New affiliates joining get your info
                automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              ⏱️
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Save Time & Money
              </h3>
              <p className="text-gray-700">
                No more manually updating hundreds of affiliates. What used to
                take weeks now happens in minutes from one dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              🎯
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Brand Consistency
              </h3>
              <p className="text-gray-700">
                Control exactly how your brand appears across all affiliate
                sites. Ensure accurate, up-to-date information everywhere.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              🚀
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Launch New Properties Fast
              </h3>
              <p className="text-gray-700">
                Adding a new casino? Deploy it across the entire affiliate
                network with one click. Instant visibility and promotion.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              📈
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Scale Your Affiliate Program
              </h3>
              <p className="text-gray-700">
                As new affiliates join the network, they automatically get
                access to your casinos. Grow your reach without extra work.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              🔄
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Always Current Information
              </h3>
              <p className="text-gray-700">
                Bonuses expired? Software added? Restrictions changed? Update
                once and every affiliate site reflects the changes within an
                hour.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 text-center text-white mb-16">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Take Control of Your Brand?
        </h2>
        <p className="text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          Join the casino operators who are already managing their affiliate
          presence from one powerful dashboard.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://www.allmedidamatter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            Access Operator Portal
          </a>
          <a
            href="mailto:operators@ezcasinoaff.com"
            className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              How quickly do updates appear on affiliate sites?
            </h3>
            <p className="text-gray-600">
              Changes you make in the operator portal are pushed to all
              affiliate sites within 1 hour. The system runs automatic updates
              to ensure your information is always current.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Can I manage multiple affiliate programs?
            </h3>
            <p className="text-gray-600">
              Yes! You can add your primary affiliate program and also manage
              other programs you work with. Perfect for casino groups with
              multiple brands.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              How many affiliates will see my casino?
            </h3>
            <p className="text-gray-600">
              Your casino information is available to all active affiliates
              using EZ Casino Aff. This includes hundreds of affiliate sites,
              and the number grows as new affiliates join the network.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              What information can I manage?
            </h3>
            <p className="text-gray-600">
              Everything! Casino details, bonuses, games, banking methods,
              geo-restrictions, licenses, images, affiliate program details, and
              more. You have complete control over your brand presentation.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Is there a cost to join?
            </h3>
            <p className="text-gray-600">
              Contact us for operator portal access. We work with serious casino
              operators who want to maximize their affiliate reach and control
              their brand presence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
