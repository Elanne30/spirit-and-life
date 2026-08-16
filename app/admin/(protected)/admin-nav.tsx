"use client";

import Link from "next/link";
import { FileText, LayoutDashboard, Mail, Send, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const adminNavigation = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Content", href: "/admin/content", icon: FileText },
    ],
  },
  {
    label: "Audience & messaging",
    items: [
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { label: "Push", href: "/admin/notifications", icon: Send },
      { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin sections">
      {adminNavigation.map((group) => (
        <div className="admin-nav-group" key={group.label}>
          <span className="admin-nav-group-label">{group.label}</span>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
