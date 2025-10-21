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
      if (user && user.id) {
        // Check if this is a new user (no role or API key set)
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, apiKey: true },
        });

        // If user exists but missing role or apiKey, update them
        if (existingUser) {
          const updates: { role?: number; apiKey?: string } = {};

          if (!existingUser.role) {
            updates.role = 2; // Webmaster role
          }

          if (!existingUser.apiKey) {
            updates.apiKey = generateDemoApiKey();
          }

          // Only update if there are changes
          if (Object.keys(updates).length > 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: updates,
            });
          }
        }
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.apiKey = user.apiKey;
        session.user.image = user.image;
      }
      return session;
    },
  },
  providers,
});
