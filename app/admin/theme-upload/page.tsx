import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ThemeUploadForm from "./ThemeUploadForm";
import ThemeVersionTable from "./ThemeVersionTable";
import { prisma } from "@/lib/prisma";

export default async function ThemeUploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is super admin (role 5)
  if (session.user.role !== 5) {
    redirect("/");
  }

  // Fetch recent theme uploads
  const recentVersions = await prisma.themeVersion.findMany({
    take: 20,
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
          🎨 WordPress Theme Upload
        </h1>
        <p className="mt-2 text-gray-600">
          Upload new versions of WordPress themes. Users can download the latest
          versions from the themes page.
        </p>
      </div>

      <ThemeUploadForm />

      {/* Recent Uploads */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recent Theme Uploads
        </h2>
        <ThemeVersionTable versions={recentVersions} />
      </div>
    </div>
  );
}
