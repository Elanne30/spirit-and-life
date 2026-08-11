import Link from "next/link";
import type { Metadata } from "next";
import { scriptureReferences } from "@/app/content/scripture";

export const metadata: Metadata = {
  title: "Scripture",
  description: "Browse Scripture references connected to Spirit & Life reflections and study.",
  alternates: { canonical: "/scripture" },
};

export default function ScripturePage() {
  return (
    <main className="scripture-page">
      <section className="page-container page-intro">
        <p className="eyebrow">The Scripture Index</p>
        <h1>Scripture</h1>
        <p>Explore passages connected to Spirit &amp; Life reflections, journals, books, and study resources.</p>
      </section>
      <section className="page-container scripture-library" aria-label="Scripture references">
        <div className="scripture-grid">
          {scriptureReferences.map((reference) => (
            <article className="scripture-card" key={reference.slug}>
              <p className="content-card-label">{reference.book} · Chapter {reference.chapter}</p>
              <h2><Link href={`/scripture/${reference.slug}`}>{reference.reference}</Link></h2>
              <p>{reference.summary}</p>
              <Link className="content-card-link" href={`/scripture/${reference.slug}`}>Explore Passage →</Link>
            </article>
          ))}
        </div>
        <p className="quiet-note">Full passage text and broader Bible browsing will be connected as the Scripture service is added.</p>
      </section>
    </main>
  );
}
