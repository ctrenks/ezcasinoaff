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
          🤖 Radium Credits (AI Review Generation)
        </h1>
        <p className="text-gray-600 mb-4">
          Use Radium Credits to generate AI-powered casino and game reviews.
          Each credit generates one comprehensive review (~$3-4 value).
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-900">
            💡 <strong>How it works:</strong> Radium Credits power AI-generated
            content for SEO-optimized casino/game reviews with titles,
            descriptions, Pro/Con sections, and FAQs. Purchase via PayPal or
            cryptocurrency.
          </p>
        </div>
      </div>

      <CreditsDisplay />
    </div>
  );
}
