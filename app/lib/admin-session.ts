import "server-only";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin-auth";

export async function getAdminAccessState() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { session: null, isAdmin: false as const };
  }

  return {
    session,
    isAdmin: isAdminEmail(session.user.email),
  };
}

export async function requireAdminPageAccess() {
  const access = await getAdminAccessState();

  if (!access.session) {
    redirect("/admin/signin?callbackUrl=/admin");
  }

  if (!access.isAdmin) {
    redirect("/admin/denied");
  }

  return access.session;
}

export async function requireAdminActionAccess() {
  const access = await getAdminAccessState();
  return Boolean(access.session && access.isAdmin);
}
