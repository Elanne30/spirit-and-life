import type { Metadata } from "next";
import Link from "next/link";
import { confirmNewsletterSubscription } from "@/app/lib/newsletter";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("Confirm Subscription", "Confirm your Spirit & Life newsletter subscription.", "/newsletter/confirm");

type NewsletterConfirmPageProps = {
  searchParams?: { token?: string };
};

export default async function NewsletterConfirmPage({ searchParams }: NewsletterConfirmPageProps) {
  const token = searchParams?.token;
  const result = token ? await confirmNewsletterSubscription(token) : { status: "error" as const, message: "This confirmation link is missing its token." };

  return (
    <main className="page-container placeholder-page">
      <p className="eyebrow">Newsletter</p>
      <h1>Confirm Subscription</h1>
      <p role="status">{result.message}</p>
      <p>
        <Link href="/">Return to home</Link>
      </p>
    </main>
  );
}