import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import type { Provider } from "next-auth/providers";

// Build providers array conditionally
const providers: Provider[] = [];

// Add Resend if API key is available
if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      from: "noreply@allmediamatter.com",
      apiKey: process.env.RESEND_API_KEY,
    })
  );
}

// Add Email provider if server is configured
if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
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
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      // Set default role for new users based on domain
      if (user && !user.role) {
        // Check if this is a new user (no role set)
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        if (!existingUser?.role) {
          // Default to role 2 for excasinoaff.com users (webmasters)
          // You can detect domain from account or default to role 2
          await prisma.user.update({
            where: { id: user.id },
            data: { role: 2 },
          });
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
