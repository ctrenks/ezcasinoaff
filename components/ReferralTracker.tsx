"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ReferralTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only run once when user is authenticated
    if (status === "authenticated" && session?.user) {
      // Check if there's a referral cookie
      const refCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ref="));

      if (refCookie) {
        // Try to link the referral
        fetch("/api/referrals/link", {
          method: "POST",
        }).catch((error) => {
          console.error("Error linking referral:", error);
        });
      }
    }
  }, [status, session]);

  return null; // This component doesn't render anything
}
