import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { AdminNav } from "@/app/admin/(protected)/admin-nav";
import { siteConfig } from "@/app/content/site-config";
import { requireAdminPageAccess } from "@/app/lib/admin-session";
import styles from "@/app/admin/(protected)/admin.module.css";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPageAccess();

  return (
    <main className={`${styles.adminRoot} admin-shell`}>
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin" aria-label="Spirit & Life Admin dashboard">
          <Image className="admin-brand-logo" src={siteConfig.brand.logo} alt="Spirit & Life Eternal" width={616} height={496} />
          <span>
            <strong>Spirit &amp; Life</strong>
            <small>Eternal · Admin</small>
          </span>
        </Link>
        <p className="admin-sidebar-label">Admin workspace</p>
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
            <h1>Spirit &amp; Life Eternal · Admin</h1>
            <p className="quiet-note">Signed in as {session.user?.email}</p>
          </div>
          <div className="admin-header-actions">
            <Link className="admin-header-link" href="/">View website</Link>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
