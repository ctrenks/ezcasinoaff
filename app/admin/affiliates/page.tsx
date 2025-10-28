import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AffiliateManagement from "./AffiliateManagement";

export default async function AdminAffiliatesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is super admin (role 5)
  if (session.user.role !== 5) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Affiliate Management
        </h1>
        <p className="mt-2 text-gray-600">
          Manage commission rates and view affiliate program statistics
        </p>
      </div>

      <AffiliateManagement />
    </div>
  );
}
