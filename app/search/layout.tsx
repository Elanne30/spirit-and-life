import type { Metadata } from "next";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("Search", "Search Reflections, Journals, Books, Scripture references, and Study Center resources across Spirit & Life.", "/search");

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
