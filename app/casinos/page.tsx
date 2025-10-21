import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CasinosPageContent from "./CasinosPageContent";

export const dynamic = "force-dynamic";

export default async function WebmasterCasinos() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <CasinosPageContent />;
}
