import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { AdminNav } from "@/app/admin/(protected)/admin-nav";
import { siteConfig } from "@/app/content/site-config";
import { requireAdminPageAccess } from "@/app/lib/admin-session";
import { ThemeToggle } from "@/app/components/theme-toggle";
import styles from "@/app/admin/(protected)/admin.module.css";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPageAccess();

  return (
    <main className={styles.adminRoot}>
      <div className="admin-shell">
        <header className="admin-topbar">
          <Link className="admin-brand" href="/admin" aria-label="Spirit & Life Admin dashboard">
            <Image className="admin-brand-logo" src={siteConfig.brand.logo} alt="Spirit & Life Eternal" width={616} height={496} />
            <span>
              <strong>Spirit &amp; Life</strong>
              <small>Admin workspace</small>
            </span>
          </Link>

          <AdminNav />

          <div className="admin-topbar-actions">
            <Link className="admin-header-link" href="/" target="_blank" rel="noreferrer">Visit public site</Link>
            <ThemeToggle />
            <Link className="admin-signout" href="/api/auth/signout?callbackUrl=%2Fadmin" aria-label="Sign out">
              <LogOut aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>Sign out</span>
            </Link>
          </div>
        </header>

        <div className="admin-content">
          <header className="admin-header">
            <div>
              <p className="eyebrow">Private control panel</p>
              <h1>Spirit &amp; Life Eternal · Admin</h1>
              <p className="quiet-note">Signed in as {session.user?.email}</p>
            </div>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
