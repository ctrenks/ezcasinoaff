import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ManualRadiumCreditAdjustment from "./ManualRadiumCreditAdjustment";

export default async function AdminRadiumCreditsPage() {
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
          🤖 Radium Credit Management
        </h1>
        <p className="mt-2 text-gray-600">
          Manually adjust user Radium Credits (AI review generation) for special
          circumstances and promotions. ~$3-4 per credit
        </p>
      </div>

      <ManualRadiumCreditAdjustment />
    </div>
  );
}
