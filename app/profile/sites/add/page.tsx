import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddSiteForm from "./AddSiteForm";

export const dynamic = "force-dynamic";

export default async function AddSitePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Site</h1>
        <p className="text-gray-600">
          Create a new site to get your API key and start integrating
        </p>
      </div>

      <AddSiteForm />
    </div>
  );
}
