"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { PublicVideoMount } from "@/app/components/public-video-mount";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <PublicVideoMount pathname={pathname} />
      <Footer />
    </>
  );
}
