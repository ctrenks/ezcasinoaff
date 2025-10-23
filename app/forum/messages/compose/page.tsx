import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ComposeMessageForm from "./ComposeMessageForm";

export default async function ComposeMessagePage({
  searchParams,
}: {
  searchParams: { to?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get recipient if specified
  let recipient = null;
  if (searchParams.to) {
    recipient = await prisma.user.findUnique({
      where: { id: searchParams.to },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Compose Private Message
      </h1>

      <ComposeMessageForm recipient={recipient} />
    </div>
  );
}
