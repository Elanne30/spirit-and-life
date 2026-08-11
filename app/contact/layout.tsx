import type { Metadata } from "next";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("Contact", "Get in touch with Spirit & Life to share a question, reflection, or thought.", "/contact");

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
