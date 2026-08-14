import Link from "next/link";
import { FileText, LayoutDashboard, LogOut, Mail, Send, Users } from "lucide-react";
import { requireAdminPageAccess } from "@/app/lib/admin-session";

const adminNavigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Push", href: "/admin/notifications", icon: Send },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPageAccess();

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin" aria-label="Spirit & Life Admin dashboard">
          <span className="admin-brand-mark">S<span>&amp;</span>L</span>
          <span>
            <strong>Spirit &amp; Life</strong>
            <small>Admin workspace</small>
          </span>
        </Link>
        <p className="admin-sidebar-label">Private control panel</p>
        <nav className="admin-nav" aria-label="Admin sections">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="admin-nav-link">
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
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
            <p className="quiet-note">Signed in and ready to tend the library.</p>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
