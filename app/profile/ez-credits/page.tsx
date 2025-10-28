import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EZCreditsDisplay from "./EZCreditsDisplay";

export const dynamic = "force-dynamic";

export default async function EZCreditsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💎 EZ Credits (Payment Currency)
        </h1>
        <p className="text-gray-600 mb-4">
          EZ Credits are your payment currency. 1 EZ Credit = $1 USD. Use them
          to pay for subscriptions and services.
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            💡 <strong>How to get EZ Credits:</strong> EZ Credits can only be
            purchased via cryptocurrency. Contact support@ezcasinoaff.com with
            your preferred crypto and the amount you&apos;d like to purchase.
            We&apos;ll manually credit your account after payment confirmation.
          </p>
        </div>
      </div>

      <EZCreditsDisplay />
    </div>
  );
}
