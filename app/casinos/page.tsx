import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WebmasterCasinos() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Casino Brands</h1>
        <p className="text-gray-600 mt-2">
          Browse approved casino brands available in your demo package
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">🎰</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Casino Directory Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          You&apos;ll be able to browse up to 50 approved casino brands with:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700 mb-8">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Detailed casino information
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Bonuses and promotions
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Payment methods and jurisdictions
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Affiliate program links
          </li>
        </ul>
        <p className="text-sm text-gray-500">
          Currently accessible via API. Web interface coming soon.
        </p>
      </div>
    </div>
  );
}
