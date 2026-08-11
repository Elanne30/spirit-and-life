import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin-auth";

type AdminSignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminSignInPage({ searchParams }: AdminSignInPageProps) {
  const session = await getServerSession(authOptions);
  const query = await searchParams;
  const callbackUrl = query.callbackUrl && query.callbackUrl.startsWith("/") ? query.callbackUrl : "/admin";
  const signInHref = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  if (session?.user?.email && isAdminEmail(session.user.email)) {
    redirect("/admin");
  }

  const showAccessDenied = query.error === "AccessDenied";

  return (
    <main className="page-container admin-auth-page">
      <p className="eyebrow">Private Area</p>
      <h1>Spirit &amp; Life Admin</h1>
      <p>Sign in with an authorized Google account to access the private control panel.</p>
      {showAccessDenied ? <p className="form-error" role="alert">That Google account is not authorized for Spirit &amp; Life administration.</p> : null}
      <p>
        <Link className="button button-primary" href={signInHref}>Sign in with Google</Link>
      </p>
      <p className="quiet-note">
        <Link href="/">Return to public website</Link>
      </p>
    </main>
  );
}
