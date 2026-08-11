import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedContent } from "@/app/components/related-content";
import { getScriptureReference, scriptureReferences } from "@/app/content/scripture";

export function generateStaticParams() {
  return scriptureReferences.map((reference) => ({ reference: reference.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ reference: string }> }): Promise<Metadata> {
  const { reference: slug } = await params;
  const scripture = getScriptureReference(slug);

  return scripture
    ? {
        title: scripture.reference,
        description: scripture.summary,
        alternates: { canonical: `/scripture/${scripture.slug}` },
      }
    : { title: "Scripture" };
}

export default async function ScriptureReferencePage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference: slug } = await params;
  const scripture = getScriptureReference(slug);

  if (!scripture) {
    notFound();
  }

  return (
    <main className="scripture-detail-page">
      <article className="page-container scripture-detail">
        <header className="detail-header">
          <p className="eyebrow">Scripture Reference</p>
          <h1>{scripture.reference}</h1>
          <p className="scripture-summary">{scripture.summary}</p>
        </header>
        <section className="scripture-passage" aria-labelledby="passage-title">
          <p className="content-card-label">{scripture.book} · Chapter {scripture.chapter}</p>
          <h2 id="passage-title">{scripture.passage}</h2>
          <p className="quiet-note">Passage text will be connected through the Scripture service. This reference is ready to collect related Spirit &amp; Life content.</p>
        </section>
        <RelatedContent relations={scripture} />
        <Link className="button button-text" href="/scripture">Back to Scripture</Link>
      </article>
    </main>
  );
}
