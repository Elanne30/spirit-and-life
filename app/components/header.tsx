"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { navigation } from "@/app/content/navigation";
import { siteConfig } from "@/app/content/site-config";

const adminNavigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Content", href: "/admin/content" },
  { label: "Audience", href: "/admin/subscribers" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Push", href: "/admin/notifications" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <header className={`site-header${isAdmin ? " admin-site-header" : ""}`}>
      <Link className="skip-link" href="#main-content">Skip to content</Link>
      <div className="page-container header-inner">
        <Link className="brand-link" href={isAdmin ? "/admin" : "/"} onClick={() => setMenuOpen(false)} aria-label={isAdmin ? "Spirit & Life Admin dashboard" : "Spirit & Life home"}>
          <Image className="brand-logo" src={siteConfig.brand.logo} alt="Spirit & Life" width={616} height={496} />
          <span className="brand-copy">
            <strong>Spirit &amp; Life</strong>
            <small>{isAdmin ? "Admin workspace" : "A library of reflective truths"}</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`main-navigation${menuOpen ? " is-open" : ""}${isAdmin ? " admin-main-navigation" : ""}`}
          id="main-navigation"
          aria-label={isAdmin ? "Admin navigation" : "Main navigation"}
        >
          {isAdmin ? (
            <>
              {adminNavigation.map((item) => {
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={isActive ? "is-active" : undefined}
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link className="admin-visit-link" href="/" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
                Visit site
              </Link>
              <Link className="admin-signout-link" href="/api/auth/signout?callbackUrl=%2Fadmin" onClick={() => setMenuOpen(false)} aria-label="Sign out">
                <LogOut aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>Sign out</span>
              </Link>
              <ThemeToggle />
            </>
          ) : (
            <>
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link className={isActive ? "is-active" : undefined} key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={isActive ? "page" : undefined}>
                    {item.label}
                  </Link>
                );
              })}
              <Link className="search-button" href="/search" aria-label="Search">
                <span aria-hidden="true" />
                <span className="search-button-label">Search</span>
              </Link>
              <ThemeToggle />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
