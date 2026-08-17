import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/content/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
