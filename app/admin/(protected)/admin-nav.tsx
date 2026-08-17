"use client";

import Link from "next/link";
import { FileText, LayoutDashboard, Mail, Menu, MessageSquare, Send, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Push", href: "/admin/notifications", icon: Send },
      { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <div className="admin-navigation-shell">
      <button
        className="admin-menu-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="admin-navigation"
        aria-label={open ? "Collapse admin navigation" : "Open admin navigation"}
      >
        {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
        <span>{open ? "Collapse menu" : "Menu"}</span>
      </button>

      <nav className={`admin-nav${open ? " is-open" : ""}`} id="admin-navigation" aria-label="Admin sections">
        {adminNavigation.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <span className="admin-nav-group-label">{group.label}</span>
            <div className="admin-nav-group-items">
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
                    onClick={() => setOpen(false)}
                  >
                    <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
