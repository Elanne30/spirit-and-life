"use client";

import { useEffect, useSyncExternalStore } from "react";

const themeKey = "spirit-life-theme";

type ThemeMode = "light" | "dark";
const themeChangedEvent = "spirit-life-theme-changed";

function getDocumentTheme(): ThemeMode | null {
  if (typeof document === "undefined") {
    return null;
  }

  const value = document.documentElement.dataset.theme;
  return value === "light" || value === "dark" ? value : null;
}

function subscribeToTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(themeChangedEvent, onStoreChange);

  return () => {
    window.removeEventListener(themeChangedEvent, onStoreChange);
  };
}

function publishThemeChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(themeChangedEvent));
  }
}

function readTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(themeKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getDocumentTheme, () => null);

  useEffect(() => {
    const initialTheme = readTheme();
    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.style.colorScheme = initialTheme;
    publishThemeChange();
  }, []);

  function toggleTheme() {
    if (!theme) {
      return;
    }

    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(themeKey, nextTheme);
    publishThemeChange();
  }

  const isReady = theme !== null;
  const nextThemeLabel = isReady ? (theme === "dark" ? "light" : "dark") : "theme";

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isReady ? `Switch to ${nextThemeLabel} theme` : "Toggle theme"}
      aria-pressed={isReady ? theme === "light" : undefined}
      disabled={!isReady}
    >
      <span aria-hidden="true" className="theme-icon">◐</span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}