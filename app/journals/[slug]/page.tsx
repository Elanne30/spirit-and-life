import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedContent } from "@/app/components/related-content";
import { articleMetadata } from "@/app/content/seo";
import { getPublishedJournal, listPublishedJournals } from "@/app/content/repository";

export function generateStaticParams() {
  return listPublishedJournals().map((journal) => ({ slug: journal.contentSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const journal = getPublishedJournal(slug);
  return journal ? articleMetadata(journal.title, journal.introduction, `/journals/${journal.contentSlug}`) : articleMetadata("Journals", "Personal observations and reflections from Spirit & Life.", "/journals");
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journal = getPublishedJournal(slug);

  if (!journal) {
    notFound();
  }

  return (
    <main className="journal-detail-page">
      <article className="journal-detail">
        <header className="journal-detail-header page-container detail-header">
          <p className="eyebrow">Journal</p>
          <h1>{journal.title}</h1>
          <div className="journal-meta">
            <span>{journal.date}</span>
            <span>{journal.label}</span>
          </div>
        </header>
        <div className="journal-feature-image page-container">
          <Image
            src={journal.image}
            alt={journal.title}
            width={1280}
            height={853}
            priority
            sizes="(max-width: 1220px) 100vw, 76rem"
          />
        </div>
        <div className="journal-reading-column">
          <p className="journal-introduction">{journal.introduction}</p>
          {journal.sections.map((section) => (
            <section className="reading-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <Link className="button button-text" href="/journals">
            Back to Journals
          </Link>
          <RelatedContent relations={journal} />
        </div>
      </article>
    </main>
  );
}
