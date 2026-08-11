import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/app/lib/admin-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/admin/signin",
    error: "/admin/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return false;
      }

      return isAdminEmail(user.email ?? "");
    },
    async jwt({ token }) {
      token.isAdmin = isAdminEmail(token.email ?? "");
      return token;
    },
    async session({ session, token }) {
      session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    },
  },
};
