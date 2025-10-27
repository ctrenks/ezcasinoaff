import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NotificationsPageClient from "./NotificationsPageClient";

export const metadata = {
  title: "Notifications - EZ Casino Affiliates",
  description: "View all your notifications",
};

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          Stay updated with messages, forum activity, and system updates
        </p>
      </div>

      <NotificationsPageClient />
    </div>
  );
}
