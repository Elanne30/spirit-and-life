import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalArticle } from "@/app/components/journal-article";
import { articleMetadata } from "@/app/content/seo";
import { getPublishedJournal, listPublishedJournals } from "@/app/content/repository";

export async function generateStaticParams() {
  const journals = await listPublishedJournals();
  return journals.map((journal) => ({ slug: journal.contentSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const journal = await getPublishedJournal(slug);
  return journal ? articleMetadata(journal.title, journal.introduction, `/journals/${journal.contentSlug}`) : articleMetadata("Journals", "Personal observations and reflections from Spirit & Life.", "/journals");
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

  return <JournalArticle journal={journal} />;
}
