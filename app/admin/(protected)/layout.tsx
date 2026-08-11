import Link from "next/link";
import { requireAdminPageAccess } from "@/app/lib/admin-session";

const adminNavigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Content", href: "/admin/content" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Push", href: "/admin/notifications" },
  { label: "Subscribers", href: "/admin/subscribers" },
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPageAccess();

  return (
    <main className="admin-shell page-container">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Private Control Panel</p>
          <h1>Spirit &amp; Life Admin</h1>
          <p className="quiet-note">Signed in as {session.user?.email}</p>
        </div>
        <Link className="button button-secondary" href="/api/auth/signout?callbackUrl=%2Fadmin%2Fsignin">
          Sign out
        </Link>
      </header>

      <nav className="admin-nav" aria-label="Admin sections">
        {adminNavigation.map((item) => (
          <Link key={item.href} href={item.href} className="admin-nav-link">
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </main>
  );
}
