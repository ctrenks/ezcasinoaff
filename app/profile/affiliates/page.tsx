import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AffiliatesDashboard from "./AffiliatesDashboard";

export default async function AffiliatesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Affiliate Program</h1>
        <p className="mt-2 text-gray-600">
          Earn commissions by referring new users to our platform
        </p>
      </div>

      <AffiliatesDashboard />
    </div>
  );
}
