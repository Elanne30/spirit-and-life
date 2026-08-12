import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/app/lib/admin-auth";

function getSafeMetadataKeys(metadata: unknown): string[] {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }

  const sensitiveKeyPattern =
    /(token|secret|cookie|session|authorization|access|id_token|client|code)/i;

  return Object.keys(metadata as Record<string, unknown>).filter(
    (key) => !sensitiveKeyPattern.test(key),
  );
}

function getErrorName(error: unknown): string {
  if (error instanceof Error && error.name) {
    return error.name;
  }

  return "UnknownError";
}

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
  logger: {
    error(code, metadata) {
      const safeMetadataKeys = getSafeMetadataKeys(metadata);

      console.error("[auth][diagnostic] nextauth.error", {
        code,
        hasMetadata: Boolean(metadata),
        safeMetadataKeys,
      });
    },
    warn(code) {
      console.warn("[auth][diagnostic] nextauth.warn", { code });
    },
    debug(code, metadata) {
      const safeMetadataKeys = getSafeMetadataKeys(metadata);

      console.debug("[auth][diagnostic] nextauth.debug", {
        code,
        hasMetadata: Boolean(metadata),
        safeMetadataKeys,
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const hasUserEmail = Boolean(user.email);

      console.info("[auth][diagnostic] signIn callback reached", {
        reached: true,
        provider: account?.provider ?? null,
        accountType: account?.type ?? null,
        hasUserEmail,
      });

      if (account?.provider !== "google") {
        console.warn("[auth][diagnostic] signIn denied for non-google provider", {
          provider: account?.provider ?? null,
          accountType: account?.type ?? null,
        });
        return false;
      }

      try {
        const isAdmin = isAdminEmail(user.email ?? "");

        console.info("[auth][diagnostic] google signIn admin check", {
          provider: account.provider,
          accountType: account.type ?? null,
          hasUserEmail,
          isAdminEmailResult: isAdmin,
        });

        return isAdmin;
      } catch (error) {
        console.error("[auth][diagnostic] signIn callback error", {
          provider: account.provider,
          accountType: account.type ?? null,
          hasUserEmail,
          errorName: getErrorName(error),
        });

        throw error;
      }
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
