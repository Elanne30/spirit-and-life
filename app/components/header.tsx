"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { navigation } from "@/app/content/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link className="wordmark" href="/" onClick={() => setMenuOpen(false)}>
          <span>Spirit</span>
          <span>&amp; Life</span>
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
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}