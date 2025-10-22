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
          Radium Credits
        </h1>
        <p className="text-gray-600 mb-4">
          AI-powered content generation for SEO-optimized casino and game reviews
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            💡 <strong>How it works:</strong> Use Radium Credits to instantly
            generate comprehensive reviews with SEO-optimized titles, descriptions,
            Pro/Con sections, and FAQs. Each review is ready to publish or can be
            manually tweaked for maximum impact.
          </p>
        </div>
      </div>

      <CreditsDisplay />
    </div>
  );
}
