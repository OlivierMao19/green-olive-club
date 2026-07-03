import NextAuth, { DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Resend from "next-auth/providers/resend";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      isAdmin?: boolean;
      mcgillId?: string;
    } & DefaultSession["user"];
  }

}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify-request",
  },
  providers: [
    GitHub,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      // If your environment variable is named differently than default
      from: "no-reply@goccc.ca",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user?.email ?? profile?.email;
      if (!email || !account?.provider) return true;

      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { accounts: { select: { provider: true } } },
      });

      if (!existingUser?.accounts.length) return true;

      const hasMatchingProvider = existingUser.accounts.some(
        (linkedAccount) => linkedAccount.provider === account.provider
      );
      if (hasMatchingProvider) return true;

      const providers = [
        ...new Set(existingUser.accounts.map((linkedAccount) => linkedAccount.provider)),
      ].join(",");

      const params = new URLSearchParams({
        error: "OAuthAccountNotLinked",
        providers,
      });

      return `/login?${params.toString()}`;
    },

    async session({ session }) {
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, isAdmin: true, mcgillId: true },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.isAdmin = dbUser.isAdmin;
          session.user.mcgillId = dbUser.mcgillId ?? undefined;
        }
      }

      return session;
    },

  },
});
