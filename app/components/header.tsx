"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { navigation } from "@/app/content/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link className="brand-link" href="/" onClick={() => setMenuOpen(false)}>
          <Image className="brand-logo" src="/spiri_life_logo.jpg" alt="Spirit & Life" width={1280} height={853} />
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
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <button className="search-button" type="button" aria-label="Search">
            <span aria-hidden="true" />
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}