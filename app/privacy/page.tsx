import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | EZ Casino Affiliates",
  description: "Privacy Policy for EZ Casino Affiliates",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
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
              1. Introduction
            </h2>
            <p className="text-gray-700 mb-4">
              EZ Casino Affiliates ("we", "our", or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our Service.
            </p>
            <p className="text-gray-700 mb-4">
              Please read this privacy policy carefully. If you do not agree
              with the terms of this privacy policy, please do not access the
              Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2.1 Personal Information
            </h3>
            <p className="text-gray-700 mb-4">
              We collect personal information that you voluntarily provide to us
              when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Register for an account</li>
              <li>Subscribe to our services</li>
              <li>Make a payment</li>
              <li>Contact us for support</li>
              <li>Participate in our affiliate program</li>
            </ul>
            <p className="text-gray-700 mb-4">This information may include:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Payment information (processed securely through PayPal)</li>
              <li>Profile information (Skype, Telegram handles)</li>
              <li>Website domain and business information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              2.2 OAuth Authentication
            </h3>
            <p className="text-gray-700 mb-4">
              When you sign in using Google OAuth or other third-party
              authentication providers, we receive:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Your name and email address</li>
              <li>Profile picture (if available)</li>
              <li>Unique identifier from the authentication provider</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not have access to your password when you use OAuth
              authentication.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              2.3 Automatically Collected Information
            </h3>
            <p className="text-gray-700 mb-4">
              When you access our Service, we automatically collect certain
              information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>API usage data and request logs</li>
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
              <li>Error logs and diagnostics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process your subscriptions and payments</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Process affiliate commissions and referrals</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-4">
              We may share your information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              4.1 Service Providers
            </h3>
            <p className="text-gray-700 mb-4">
              We work with third-party service providers who perform services on
              our behalf:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Payment processing (PayPal)</li>
              <li>Cloud hosting and storage (Vercel, database providers)</li>
              <li>Email delivery services</li>
              <li>Authentication services (Google OAuth)</li>
              <li>Analytics services</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              4.2 Legal Requirements
            </h3>
            <p className="text-gray-700 mb-4">
              We may disclose your information if required to do so by law or in
              response to valid requests by public authorities.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              4.3 Business Transfers
            </h3>
            <p className="text-gray-700 mb-4">
              If we are involved in a merger, acquisition, or sale of assets,
              your information may be transferred as part of that transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security
              measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication using NextAuth.js</li>
              <li>API keys for authorized access only</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and monitoring</li>
            </ul>
            <p className="text-gray-700 mb-4">
              However, no method of transmission over the Internet is 100%
              secure. While we strive to protect your information, we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide you with our Service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Maintain business records</li>
            </ul>
            <p className="text-gray-700 mb-4">
              When you close your account, we will delete or anonymize your
              personal information within a reasonable timeframe, unless we are
              required to retain it for legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Your Privacy Rights
            </h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of your personal
                information
              </li>
              <li>
                <strong>Correction:</strong> Update or correct your information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Objection:</strong> Object to processing of your
                information
              </li>
              <li>
                <strong>Portability:</strong> Request transfer of your data to
                another service
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Opt out of marketing
                communications
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, please contact us using the information
              provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Maintain your session and keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze how you use our Service</li>
              <li>Improve performance and functionality</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings, but
              disabling cookies may affect the functionality of our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Third-Party Links
            </h2>
            <p className="text-gray-700 mb-4">
              Our Service may contain links to third-party websites or services.
              We are not responsible for the privacy practices of these third
              parties. We encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-4">
              Our Service is not intended for children under the age of 18. We
              do not knowingly collect personal information from children. If
              you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. International Data Transfers
            </h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. By using our Service, you consent
              to such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. California Privacy Rights (CCPA)
            </h2>
            <p className="text-gray-700 mb-4">
              If you are a California resident, you have additional rights under
              the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>
                Right to know if personal information is sold or disclosed
              </li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. GDPR Rights (European Users)
            </h2>
            <p className="text-gray-700 mb-4">
              If you are located in the European Economic Area (EEA), you have
              rights under the General Data Protection Regulation (GDPR),
              including the right to access, rectification, erasure,
              restriction, portability, and objection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date. Significant
              changes will be communicated via email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us through the contact information
              provided on our website.
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
