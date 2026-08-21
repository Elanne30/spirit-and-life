import { Header } from "@/app/components/header";
import { AdminNav } from "@/app/admin/(protected)/admin-nav";
import { requireAdminPageAccess } from "@/app/lib/admin-session";
import styles from "@/app/admin/(protected)/admin.module.css";
import shellStyles from "@/app/admin/(protected)/admin-shell-overrides.module.css";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPageAccess();
  return <main className={`${styles.adminRoot} ${shellStyles.adminOverrides}`}><Header /><div className="admin-shell"><AdminNav /><div className="admin-content"><header className="admin-header"><div><p className="eyebrow">Private control panel</p><h1>Spirit &amp; Life Eternal · Admin</h1><p className="quiet-note">Signed in as {session.user?.email}</p></div></header>{children}</div></div></main>;
}
