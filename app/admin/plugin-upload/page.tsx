import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PluginUploadForm from "./PluginUploadForm";
import PluginVersionTable from "./PluginVersionTable";
import { prisma } from "@/lib/prisma";

export default async function PluginUploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is super admin (role 5)
  if (session.user.role !== 5) {
    redirect("/");
  }

  // Fetch recent uploads
  const recentVersions = await prisma.pluginVersion.findMany({
    take: 10,
    orderBy: { uploadedAt: "desc" },
    include: {
      uploader: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          🔌 Radium Plugin Upload
        </h1>
        <p className="mt-2 text-gray-600">
          Upload new versions of the Radium WordPress plugin. Users can download
          the latest 10 versions from the download page.
        </p>
      </div>

      <PluginUploadForm />

      {/* Recent Uploads */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recent Uploads
        </h2>
        <PluginVersionTable versions={recentVersions} />
      </div>
    </div>
  );
}
