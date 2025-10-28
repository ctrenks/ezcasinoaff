import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInForm from "./SignInForm";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const session = await auth();

  // Redirect to home if already signed in
  if (session?.user) {
    redirect("/");
  }

  const referralCode = searchParams.ref;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          {referralCode && (
            <p className="mt-2 text-center text-sm text-green-600 dark:text-green-400">
              🎉 You&apos;ve been referred! Sign up to get started.
            </p>
          )}
        </div>
        <SignInForm referralCode={referralCode} />
      </div>
    </div>
  );
}
