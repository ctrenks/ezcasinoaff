import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | EZ Casino Affiliates",
  description: "Terms of Service for EZ Casino Affiliates",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Terms of Service
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-6">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using EZ Casino Affiliates ("Service"), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to these terms, please do not use
              our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-4">
              EZ Casino Affiliates provides casino and gaming affiliate program
              management services, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>API access to casino and game data</li>
              <li>Affiliate program tracking and management</li>
              <li>Content generation tools</li>
              <li>WordPress plugin for integration</li>
              <li>Credit system for premium features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Account Registration
            </h2>
            <p className="text-gray-700 mb-4">To use our Service, you must:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years of age</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Subscriptions and Payments
            </h2>
            <p className="text-gray-700 mb-4">
              Our Service offers various subscription plans (Basic, Pro,
              Everything) with annual billing. By subscribing, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                Pay all fees associated with your chosen subscription plan
              </li>
              <li>
                Automatic renewal unless cancelled before the renewal date
              </li>
              <li>No refunds for partial subscription periods</li>
              <li>Price changes with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. API Usage and Restrictions
            </h2>
            <p className="text-gray-700 mb-4">
              When using our API, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                Not exceed rate limits specified in your subscription plan
              </li>
              <li>Not share your API keys with third parties</li>
              <li>Not use the Service for illegal or unauthorized purposes</li>
              <li>Not attempt to reverse engineer or compromise the Service</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Affiliate Program
            </h2>
            <p className="text-gray-700 mb-4">
              Our affiliate/referral program allows you to earn commissions on
              referred customers. By participating, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Promote the Service in an honest and ethical manner</li>
              <li>Not engage in spam or misleading advertising</li>
              <li>Commission rates may be adjusted with notice</li>
              <li>Commissions are paid according to our payment schedule</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">
              All content, features, and functionality of the Service are owned
              by EZ Casino Affiliates and are protected by copyright, trademark,
              and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Reproduce or distribute our content without permission</li>
              <li>Create derivative works from our Service</li>
              <li>Remove copyright or proprietary notices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Data Provided Through API
            </h2>
            <p className="text-gray-700 mb-4">
              Casino and game data provided through our API is for informational
              purposes. We strive for accuracy but do not guarantee that all
              information is current or error-free. You are responsible for how
              you use and display this data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Termination
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your account if you:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Violate these Terms of Service</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Abuse the Service or harm other users</li>
              <li>Fail to pay fees when due</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 mb-4">
              The Service is provided "as is" and "as available" without
              warranties of any kind, either express or implied, including but
              not limited to warranties of merchantability, fitness for a
              particular purpose, or non-infringement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              EZ Casino Affiliates shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting
              from your use or inability to use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. We will
              notify users of significant changes via email or through the
              Service. Continued use of the Service after changes constitutes
              acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which EZ Casino Affiliates
              operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please
              contact us through the contact information provided on our
              website.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
