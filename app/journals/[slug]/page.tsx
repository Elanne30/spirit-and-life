import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalArticle } from "@/app/components/journal-article";
import { articleMetadata, articleStructuredData } from "@/app/content/seo";
import { getPublishedJournal } from "@/app/content/repository";

// Journals are database-backed and can be published from Admin at any time.
// Keep the detail route dynamic so Previous/Next always sees the current
// published collection instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const journal = await getPublishedJournal(slug);
  return journal ? articleMetadata(journal.title, journal.introduction, `/journals/${journal.contentSlug}`, journal.image) : articleMetadata("Journals", "Personal observations and reflections from Spirit & Life.", "/journals");
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journal = await getPublishedJournal(slug);

  if (!journal) {
    notFound();
  }

  const structuredData = articleStructuredData({
    title: journal.title,
    description: journal.introduction,
    path: `/journals/${journal.contentSlug}`,
    image: journal.image,
    date: journal.date,
  });

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <JournalArticle journal={journal} />
  </>;
}
