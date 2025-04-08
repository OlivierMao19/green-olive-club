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
