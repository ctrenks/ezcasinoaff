import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SubscriptionManagement from "./SubscriptionManagement";

export default async function AdminSubscriptionsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        <p className="mt-2 text-gray-600">
          View and manage all subscriptions. Change plans, status, and extend subscriptions.
        </p>
      </div>

      <SubscriptionManagement />
    </div>
  );
}
