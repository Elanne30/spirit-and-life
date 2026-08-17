"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { navigation } from "@/app/content/navigation";
import { siteConfig } from "@/app/content/site-config";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="skip-link" href="#main-content">Skip to content</Link>
      <div className="page-container header-inner">
        <Link className="brand-link" href="/" onClick={() => setMenuOpen(false)}>
          <Image className="brand-logo" src={siteConfig.brand.logo} alt="Spirit & Life" width={616} height={496} />
          <span className="brand-copy">
            <strong>Spirit &amp; Life</strong>
            <small>A library of reflective truths</small>
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
          className={`main-navigation${menuOpen ? " is-open" : ""}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
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
        </nav>
      </div>
    </header>
  );
}