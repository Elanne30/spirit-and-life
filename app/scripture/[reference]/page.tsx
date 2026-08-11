import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScriptureReference, scriptureReferences } from "@/app/content/scripture";
import { reflections } from "@/app/data/reflections";

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

  const relatedReflections = reflections.filter((reflection) => scripture.relatedReflectionSlugs?.includes(reflection.contentSlug));

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
        {relatedReflections.length ? (
          <section className="scripture-related" aria-labelledby="related-scripture-title">
            <h2 id="related-scripture-title">Related Reflections</h2>
            <ul>
              {relatedReflections.map((reflection) => <li key={reflection.contentSlug}><Link href={`/reflections/${reflection.contentSlug}`}>{reflection.title}</Link></li>)}
            </ul>
          </section>
        ) : null}
        <Link className="button button-text" href="/scripture">Back to Scripture</Link>
      </article>
    </main>
  );
}
