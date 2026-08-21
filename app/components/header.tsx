"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { navigation, type NavigationItem } from "@/app/content/navigation";
import { siteConfig } from "@/app/content/site-config";

const adminNavigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Content", href: "/admin/content" },
  { label: "Audience", href: "/admin/subscribers" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Push", href: "/admin/notifications" },
];

function isItemActive(item: NavigationItem, pathname: string) {
  if (item.href) return pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
  return item.children?.some((child) => isItemActive(child, pathname)) ?? false;
}

function PublicNavigationItem({ item, pathname, closeMenu }: { item: NavigationItem; pathname: string; closeMenu: () => void }) {
  const active = isItemActive(item, pathname);

  if (!item.children) {
    return (
      <Link className={active ? "is-active" : undefined} href={item.href!} onClick={closeMenu} aria-current={active ? "page" : undefined}>
        {item.label}
      </Link>
    );
  }

  return (
    <div className={`navigation-group${active ? " is-active" : ""}`}>
      <button className="navigation-group-trigger" type="button" aria-expanded="false">
        <span>{item.label}</span>
        <ChevronDown aria-hidden="true" size={13} strokeWidth={1.7} />
      </button>
      <div className="navigation-dropdown" role="menu">
        {item.children.map((child) => {
          const childActive = isItemActive(child, pathname);
          return (
            <Link key={child.href} className={childActive ? "is-active" : undefined} href={child.href!} onClick={closeMenu} role="menuitem" aria-current={childActive ? "page" : undefined}>
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${isAdmin ? " admin-site-header" : ""}`}>
      <Link className="skip-link" href="#main-content">Skip to content</Link>
      <div className="page-container header-inner">
        <Link
          className="brand-logo-link"
          href={isAdmin ? "/admin" : "/"}
          onClick={closeMenu}
          aria-label={isAdmin ? "Spirit & Life Admin dashboard" : "Spirit & Life home"}
          style={{ width: "auto", height: "4.75rem", border: "0", borderRadius: 0, background: "transparent", boxShadow: "none", overflow: "visible" }}
        >
          <Image
            className="brand-logo"
            src={siteConfig.brand.logo}
            alt="Spirit & Life"
            width={616}
            height={496}
            style={{ width: "4.75rem", height: "4.75rem", objectFit: "contain", mixBlendMode: "normal", opacity: 1 }}
          />
          <span className="brand-copy">
            <strong>Spirit &amp; Life</strong>
            <small>{isAdmin ? "Admin workspace" : "A library of reflective truths"}</small>
          </span>
        </Link>

        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
        </button>

        <nav className={`main-navigation${menuOpen ? " is-open" : ""}${isAdmin ? " admin-main-navigation" : ""}`} id="main-navigation" aria-label={isAdmin ? "Admin navigation" : "Main navigation"}>
          {isAdmin ? (
            <>
              {adminNavigation.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return <Link className={active ? "is-active" : undefined} key={item.href} href={item.href} onClick={closeMenu} aria-current={active ? "page" : undefined}>{item.label}</Link>;
              })}
              <Link className="admin-visit-link" href="/" target="_blank" rel="noreferrer" onClick={closeMenu}>Visit site</Link>
              <Link className="admin-signout-link" href="/api/auth/signout?callbackUrl=%2Fadmin" onClick={closeMenu} aria-label="Sign out"><LogOut aria-hidden="true" size={16} strokeWidth={1.8} /><span>Sign out</span></Link>
              <ThemeToggle />
            </>
          ) : (
            <>
              {navigation.map((item) => <PublicNavigationItem key={item.label} item={item} pathname={pathname} closeMenu={closeMenu} />)}
              <Link className="search-button" href="/search" aria-label="Search"><span aria-hidden="true" /><span className="search-button-label">Search</span></Link>
              <ThemeToggle />
            </>
          )}
        </nav>
      </div>

      {!isAdmin ? <style>{`
        .navigation-group { position: relative; display: flex; align-items: center; }
        .navigation-group-trigger { display: inline-flex; align-items: center; gap: .28rem; padding: .45rem 0; border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; }
        .navigation-group.is-active .navigation-group-trigger { color: var(--foreground); }
        .navigation-dropdown { position: absolute; z-index: 50; top: calc(100% + .65rem); left: 50%; min-width: 11rem; padding: .45rem; border: 1px solid var(--line); background: var(--surface); box-shadow: 0 .8rem 2rem var(--shadow); opacity: 0; visibility: hidden; transform: translate(-50%, -.35rem); transition: opacity 150ms ease, transform 150ms ease, visibility 150ms ease; }
        .navigation-group:hover .navigation-dropdown, .navigation-group:focus-within .navigation-dropdown { opacity: 1; visibility: visible; transform: translate(-50%, 0); }
        .navigation-dropdown a { display: block; padding: .65rem .75rem; white-space: nowrap; }
        .navigation-dropdown a:hover, .navigation-dropdown a.is-active { background: var(--surface-muted); color: var(--foreground); }
        @media (max-width: 62rem) {
          .main-navigation.is-open .navigation-group { display: block; }
          .main-navigation.is-open .navigation-group-trigger { width: 100%; justify-content: space-between; padding: .75rem 0; }
          .main-navigation.is-open .navigation-dropdown { position: static; min-width: 0; padding: 0 0 .35rem 1rem; border: 0; box-shadow: none; opacity: 1; visibility: visible; transform: none; background: transparent; }
          .main-navigation.is-open .navigation-dropdown a { padding: .5rem 0; }
        }
      `}</style> : null}
    </header>
  );
}
