import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { AdminNav } from "@/app/admin/(protected)/admin-nav";
import { siteConfig } from "@/app/content/site-config";
import { requireAdminPageAccess } from "@/app/lib/admin-session";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPageAccess();

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin" aria-label="Spirit & Life Admin dashboard">
          <Image className="admin-brand-logo" src={siteConfig.brand.logo} alt="" width={616} height={496} />
          <span>
            <strong>Spirit &amp; Life</strong>
            <small>Admin workspace</small>
          </span>
        </Link>
        <p className="admin-sidebar-label">Private control panel</p>
        <AdminNav />
        <div className="admin-sidebar-footer">
          <p className="quiet-note">{session.user?.email}</p>
          <Link className="admin-signout" href="/api/auth/signout?callbackUrl=%2Fadmin%2Fsignin">
            <LogOut aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div>
            <p className="eyebrow">Private control panel</p>
            <h1>Spirit &amp; Life Admin</h1>
            <p className="quiet-note">Signed in as {session.user?.email}</p>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
