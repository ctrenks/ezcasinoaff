import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewTopicForm from "./NewTopicForm";

async function getCategories() {
  try {
    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3001"
      }/api/forum/categories`,
      { cache: "no-store" }
    );
    if (!response.ok) return { categories: [] };
    const data = await response.json();
    return data;
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
