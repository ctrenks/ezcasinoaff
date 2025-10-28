import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ManualCreditAdjustment from "./ManualCreditAdjustment";

export default async function AdminCreditsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is super admin (role 0)
  if (session.user.role !== 0) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Credit Management</h1>
        <p className="mt-2 text-gray-600">
          Manually adjust user credits for crypto payments and other custom
          transactions
        </p>
      </div>

      <ManualCreditAdjustment />
    </div>
  );
}
