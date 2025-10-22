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
        <p className="text-gray-600">
          Manage your credit balance and purchase history
        </p>
      </div>

      <CreditsDisplay />
    </div>
  );
}
