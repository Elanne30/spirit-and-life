import type { Metadata } from "next";
import Link from "next/link";
import { unsubscribeNewsletter } from "@/app/lib/newsletter";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("Unsubscribe", "Unsubscribe from Spirit & Life email updates.", "/unsubscribe");

type UnsubscribePageProps = {
  searchParams?: { token?: string };
};

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const token = searchParams?.token;
  const result = token ? await unsubscribeNewsletter(token) : { status: "error" as const, message: "This unsubscribe link is missing its token." };

  return (
    <main className="page-container placeholder-page">
      <p className="eyebrow">Newsletter</p>
      <h1>Unsubscribe</h1>
      <p role="status">{result.message}</p>
      <p>
        <Link href="/">Return to home</Link>
      </p>
    </main>
  );
}