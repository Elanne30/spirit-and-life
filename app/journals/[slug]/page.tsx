import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournal, journals } from "@/app/data/journals";

export function generateStaticParams() {
  return journals.map((journal) => ({ slug: journal.contentSlug }));
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journal = getJournal(slug);

  if (!journal) {
    notFound();
  }

  return (
    <main className="journal-detail-page">
      <article className="journal-detail">
        <header className="journal-detail-header page-container">
          <p className="eyebrow">Journal</p>
          <h1>{journal.title}</h1>
        </header>
        <div className="journal-feature-image page-container">
          <Image
            src={journal.image}
            alt=""
            width={1280}
            height={853}
            priority
            sizes="(max-width: 1220px) 100vw, 76rem"
          />
        </div>
        <div className="journal-reading-column">
          <p className="journal-content-status">
            The full text of this journal entry is not yet available in the
            project content files.
          </p>
          <Link className="button button-text" href="/journals">
            Back to Journals
          </Link>
        </div>
      </article>
    </main>
  );
}
