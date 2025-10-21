import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function WebmasterProfile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <ProfileForm user={session.user} />;
}
