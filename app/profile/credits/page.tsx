import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreditsDisplay from "./CreditsDisplay";

export const dynamic = "force-dynamic";

export default async function CreditsPage() {
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
          Purchase and manage your EZ Credits for subscriptions and services.
          1 Credit = $1 USD
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            💡 <strong>How it works:</strong> Purchase EZ Credits to pay for
            subscriptions, services, and more. Use them just like cash at 1:1
            value. Credits can be purchased via PayPal or cryptocurrency.
          </p>
        </div>
      </div>

      <CreditsDisplay />
    </div>
  );
}
