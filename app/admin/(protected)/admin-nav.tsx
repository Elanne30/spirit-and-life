"use client";

import Link from "next/link";
import { FileText, LayoutDashboard, Mail, MessageSquare, Send, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const adminNavigation = [
  { label: "Workspace", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }, { label: "Content", href: "/admin/content", icon: FileText }] },
  { label: "Audience & messaging", items: [{ label: "Newsletter", href: "/admin/newsletter", icon: Mail }, { label: "Messages", href: "/admin/messages", icon: MessageSquare }, { label: "Push", href: "/admin/notifications", icon: Send }, { label: "Subscribers", href: "/admin/subscribers", icon: Users }] },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Admin sections">
      {adminNavigation.map((group) => (
        <div className="admin-nav-group" key={group.label} style={{ display: "grid", gap: "0.2rem", marginBottom: "0.75rem", minWidth: "max-content" }}>
          <span className="admin-nav-group-label" style={{ margin: "0.35rem 0 0.25rem 0.55rem", color: "var(--muted)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{group.label}</span>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link key={item.href} href={item.href} className={`admin-nav-link${isActive ? " is-active" : ""}`} aria-current={isActive ? "page" : undefined}><Icon aria-hidden="true" size={17} strokeWidth={1.8} /><span>{item.label}</span></Link>;
          })}
        </div>
      ))}
    </nav>
  );
}
