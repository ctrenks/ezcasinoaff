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
