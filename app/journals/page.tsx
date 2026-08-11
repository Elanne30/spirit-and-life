import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { journals } from "@/app/data/journals";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("Journals", "Read personal observations and reflections gathered through study and life.", "/journals");

export default function JournalsPage() {
  return (
    <main className="journals-page">
      <section className="journals-introduction page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Journals</h1>
        <p>Personal observations, lessons learned, and reflections gathered through study and life.</p>
      </section>

      <section className="journal-library page-container library-section" aria-label="Journal library">
        <div className="journal-grid">
          {journals.map((journal) => (
            <article className="journal-card" key={journal.contentSlug}>
              <Link className="journal-card-image" href={`/journals/${journal.contentSlug}`}>
                <Image
                  src={journal.image}
                  alt={journal.title}
                  width={1280}
                  height={853}
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
              </Link>
              <div className="journal-card-body">
                <p className="content-card-label">{journal.date}</p>
                <h2>
                  <Link href={`/journals/${journal.contentSlug}`}>
                    {journal.title}
                  </Link>
                </h2>
                <p>{journal.introduction}</p>
                <Link className="content-card-link" href={`/journals/${journal.contentSlug}`}>
                  Read Entry →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
