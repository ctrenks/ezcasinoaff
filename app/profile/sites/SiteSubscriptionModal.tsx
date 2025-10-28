"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing";
import PayPalButton from "@/components/PayPalButton";

interface Site {
  id: string;
  domain: string;
  name: string | null;
  subscription: {
    id: string;
    plan: string;
    status: string;
    endDate: string | null;
    amount: number;
    monthlyRate: number;
  } | null;
}

interface SiteSubscriptionModalProps {
  site: Site;
  isOpen: boolean;
  onClose: () => void;
}

export default function SiteSubscriptionModal({
  site,
  isOpen,
  onClose,
}: SiteSubscriptionModalProps) {
  const { data: session } = useSession();
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    keyof typeof SUBSCRIPTION_PLANS | null
  >(null);
  const [preferredCrypto, setPreferredCrypto] = useState("BTC");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [payingWithCredits, setPayingWithCredits] = useState(false);

  // Fetch user's credit balance
  useEffect(() => {
    if (session?.user && isOpen) {
      fetch("/api/ez-credits")
        .then((res) => res.json())
        .then((data) => setUserCredits(data.balance || 0))
        .catch(() => setUserCredits(0));
    }
  }, [session, isOpen]);

  if (!isOpen) return null;

  const getCurrentPlanDetails = () => {
    if (site.subscription) {
      return SUBSCRIPTION_PLANS[
        site.subscription.plan as keyof typeof SUBSCRIPTION_PLANS
      ];
    }
    const planKey = (selectedPlan ||
      "BASIC") as keyof typeof SUBSCRIPTION_PLANS;
    return SUBSCRIPTION_PLANS[planKey];
  };

  const currentPlanDetails = getCurrentPlanDetails();
  const requiredCredits = Math.ceil(currentPlanDetails.annualPrice);
  const hasEnoughCredits =
    userCredits !== null && userCredits >= requiredCredits;

  const handleCryptoClick = (plan: any) => {
    setSelectedPlan(plan);
    setShowCryptoModal(true);
    setSubmitMessage(null);
    setMessage("");
    setPreferredCrypto("BTC");
  };

  const handlePayWithCredits = async (plan: any) => {
    if (payingWithCredits) return;

    const planRequiredCredits = Math.ceil(plan.annualPrice);
    if (userCredits === null || userCredits < planRequiredCredits) {
      alert(
        `Insufficient credits. You need ${planRequiredCredits} credits but have ${
          userCredits || 0
        }.`
      );
      return;
    }

    const confirmed = confirm(
      `Pay with ${planRequiredCredits} Radium Credits?\n\nPlan: ${
        plan.name
      }\nSite: ${
        site.name || site.domain
      }\n\nThis will deduct ${planRequiredCredits} credits from your balance.`
    );

    if (!confirmed) return;

    setPayingWithCredits(true);

    try {
      const response = await fetch("/api/credits/pay-with-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscription",
          amount: plan.annualPrice,
          planType: plan.id,
          siteId: site.id,
        }),
      });

      if (response.ok) {
        alert("Subscription activated successfully!");
        onClose();
        window.location.reload(); // Refresh to show new subscription
      } else {
        const data = await response.json();
        alert(`Payment failed: ${data.error || "Unknown error"}`);
        setPayingWithCredits(false);
      }
    } catch (error) {
      console.error("Error paying with credits:", error);
      alert("An error occurred. Please try again.");
      setPayingWithCredits(false);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      setSubmitMessage({
        type: "error",
        text: "Please select a plan first.",
      });
      return;
    }

    setSending(true);
    setSubmitMessage(null);

    const planDetails = SUBSCRIPTION_PLANS[selectedPlan];

    try {
      const response = await fetch("/api/crypto-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseType: "subscription",
          itemName: `${planDetails.name} Plan for ${site.name || site.domain}`,
          amount: planDetails.annualPrice,
          preferredCrypto,
          message: `${message}\n\nSite ID: ${site.id}\nDomain: ${site.domain}`,
        }),
      });

      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: "Your inquiry has been sent! We'll reply with payment instructions within a few hours.",
        });
        setTimeout(() => {
          setShowCryptoModal(false);
          setSubmitMessage(null);
          onClose();
        }, 3000);
      } else {
        setSubmitMessage({
          type: "error",
          text: "Failed to send inquiry. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {site.subscription ? "Manage Subscription" : "Choose a Plan"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                for {site.name || site.domain}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
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
            </button>
          </div>

          {/* Current Subscription (if exists) */}
          {site.subscription && (
            <div className="px-6 py-4 bg-green-50 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    Current Plan: {site.subscription.plan}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    ${site.subscription.monthlyRate}/mo ($
                    {site.subscription.amount}/year)
                  </p>
                  {site.subscription.endDate && (
                    <p className="text-xs text-green-600 mt-1">
                      Renews on:{" "}
                      {new Date(site.subscription.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  {site.subscription.status}
                </span>
              </div>
            </div>
          )}

          {/* Plans */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-6 ${
                    site.subscription?.plan === plan.id
                      ? "border-green-500 bg-green-50"
                      : "popular" in plan && plan.popular
                      ? "border-purple-500"
                      : "border-gray-200"
                  }`}
                >
                  {site.subscription?.plan === plan.id && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded-full mb-2">
                      Current Plan
                    </span>
                  )}
                  {"popular" in plan && plan.popular && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-600 text-white rounded-full mb-2">
                      Most Popular
                    </span>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.monthlyRate}
                      </span>
                      <span className="text-gray-600 ml-1">/mo</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${plan.annualPrice}/year billed annually
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6 text-sm">
                    {plan.featureList.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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

                  {site.subscription?.plan === plan.id ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                    >
                      ✓ Active
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-center text-gray-600 mb-2">
                        Choose payment method:
                      </p>
                      <PayPalButton
                        type="subscription"
                        amount={plan.annualPrice}
                        planType={plan.id}
                        siteId={site.id}
                        onSuccess={() => {
                          onClose();
                        }}
                      />
                      {userCredits !== null &&
                        userCredits >= Math.ceil(plan.annualPrice) && (
                          <button
                            onClick={() => handlePayWithCredits(plan)}
                            disabled={payingWithCredits}
                            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {payingWithCredits ? (
                              "Processing..."
                            ) : (
                              <>
                                💎 Pay with {Math.ceil(plan.annualPrice)}{" "}
                                Credits
                              </>
                            )}
                          </button>
                        )}
                      <button
                        onClick={() => handleCryptoClick(plan)}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300"
                      >
                        💰 Pay with Crypto
                      </button>
                      {userCredits !== null && (
                        <p className="text-xs text-center text-gray-600 mt-2">
                          Balance:{" "}
                          <strong>{userCredits.toLocaleString()}</strong>{" "}
                          credits
                          {userCredits < Math.ceil(plan.annualPrice) && (
                            <span className="text-red-600 block">
                              Need{" "}
                              {(
                                Math.ceil(plan.annualPrice) - userCredits
                              ).toLocaleString()}{" "}
                              more
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Payment Modal */}
      {showCryptoModal && selectedPlan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
          onClick={() => setShowCryptoModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              💰 Cryptocurrency Payment Inquiry
            </h3>

            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              {/* Purchase Details */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">
                  Subscription Details
                </h4>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>
                    <strong>Plan:</strong>{" "}
                    {SUBSCRIPTION_PLANS[selectedPlan].name}
                  </p>
                  <p>
                    <strong>Site:</strong> {site.name || site.domain}
                  </p>
                  <p>
                    <strong>Amount:</strong> $
                    {SUBSCRIPTION_PLANS[selectedPlan].annualPrice} USD/year
                  </p>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Account Email
                </label>
                <input
                  type="text"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {session?.user?.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={session.user.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              )}

              {/* Preferred Crypto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Cryptocurrency{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredCrypto}
                  onChange={(e) => setPreferredCrypto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="Other">Other (specify in message)</option>
                </select>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any additional information or questions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>⚡ What happens next:</strong>
                  <br />
                  We&apos;ll email you wallet address and payment instructions
                  within a few hours. After we confirm your payment, your
                  subscription will be activated immediately.
                </p>
              </div>

              {/* Success/Error Message */}
              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "📤 Send Inquiry"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCryptoModal(false)}
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
