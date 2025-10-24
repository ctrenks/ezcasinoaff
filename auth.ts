import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import type { Provider } from "next-auth/providers";
import { generateDemoApiKey } from "./lib/api-key";

// Build providers array conditionally
const providers: Provider[] = [];

// Add Resend for email authentication
if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      from: "noreply@allmediamatter.com",
      apiKey: process.env.RESEND_API_KEY,
    })
  );
}

// Add Google OAuth if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      // Set default role and generate API key for new users
      // Note: For NEW users, the PrismaAdapter creates them AFTER this callback
      // So we wrap in try-catch to handle both new and existing users gracefully
      if (user && user.id) {
        try {
          // Try to find existing user
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true, apiKey: true, ezcasino: true, allmedia: true },
          });

          // If user exists, update their fields if needed
          if (existingUser) {
            const updates: {
              role?: number;
              apiKey?: string;
              ezcasino?: boolean;
            } = {};

            if (!existingUser.role) {
              updates.role = 2; // Webmaster role
            }

            if (!existingUser.apiKey) {
              updates.apiKey = generateDemoApiKey();
            }

            // Grant access to EZ Casino Affiliates (this site) if not already set
            if (!existingUser.ezcasino) {
              updates.ezcasino = true;
            }

            // Note: allmedia flag would be set when they log into allmediamatter.com

            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
              await prisma.user.update({
                where: { id: user.id },
                data: updates,
              });
            }
          }
        } catch (error) {
          // Silently handle errors for new users during first sign-in
          // The PrismaAdapter will create the user with default values
          console.log("Sign-in callback: User not yet created, will be created by adapter");
        }
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (session?.user) {
        // Generate API key if user doesn't have one
        if (!user.apiKey) {
          try {
            const apiKey = generateDemoApiKey();
            await prisma.user.update({
              where: { id: user.id },
              data: { apiKey },
            });
            user.apiKey = apiKey;
          } catch (error) {
            console.error("Failed to generate API key:", error);
          }
        }

        session.user.id = user.id;
        session.user.role = user.role;
        session.user.apiKey = user.apiKey;
        session.user.image = user.image;
        session.user.ezcasino = user.ezcasino;
        session.user.allmedia = user.allmedia;
      }
      return session;
    },
  },
  providers,
});
