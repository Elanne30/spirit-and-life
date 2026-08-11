import type { Metadata } from "next";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("Terms of Use", "The Spirit & Life terms of use for this reading and study platform.", "/terms-of-use");

export default function TermsOfUsePage() {
  return (
    <main className="page-container placeholder-page">
      <p className="eyebrow">Site Information</p>
      <h1>Terms of Use</h1>
      <p>By using Spirit &amp; Life, you agree to engage with the content respectfully, to use it for personal reflection and study, and to avoid unauthorized reproduction or redistribution of the site’s materials.</p>
      <p>The reflections, journals, books, and study resources presented here are intended to encourage thoughtful reading and faithful study, not to replace personal discernment or pastoral guidance.</p>
      <p>If you share or quote material from the site, please attribute it clearly and avoid presenting it as an official statement beyond the context provided.</p>
    </main>
  );
}
