import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewTopicForm from "./NewTopicForm";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  try {
    const categories = await prisma.ez_forum_categories.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });

    return { categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
}

export default async function NewTopicPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user has set a username
  if (!session.user.name || session.user.name.trim() === "") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Username Required
          </h1>
          <p className="text-gray-700 mb-6">
            You need to set a username in your profile before you can create
            forum topics.
          </p>
          <Link
            href="/profile"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  const { categories } = await getCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create New Topic
      </h1>
      <NewTopicForm
        categories={categories}
        defaultCategoryId={searchParams.category}
      />
    </div>
  );
}
