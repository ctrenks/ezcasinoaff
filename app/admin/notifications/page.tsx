import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNotificationsClient from "./AdminNotificationsClient";

export const metadata = {
  title: "Admin Notifications - EZ Casino Affiliates",
  description: "Send notifications to users",
};

export default async function AdminNotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Only admins (role 5) can access this page
  if (session.user.role !== 5) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📢 Admin Notifications
        </h1>
        <p className="text-gray-600 mt-2">
          Send notifications to users about new casinos, games, or custom
          announcements
        </p>
      </div>

      <AdminNotificationsClient />
    </div>
  );
}
