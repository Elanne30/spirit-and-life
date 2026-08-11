import type { Metadata } from "next";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("Reflections", "Thoughtful writings exploring Scripture, theology, philosophy, apologetics, and Christian living.", "/reflections");

export default function ReflectionsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
