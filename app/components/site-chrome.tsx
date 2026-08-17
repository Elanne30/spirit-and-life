"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
