import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/app/content/seo";
import { listPublishedJournals } from "@/app/content/repository";

export const metadata: Metadata = pageMetadata("Journals", "Read personal observations and reflections gathered through study and life.", "/journals");

export default async function JournalsPage() {
  const journals = await listPublishedJournals();
  return (
    <main className="journals-page">
      <section className="journals-introduction page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Journals</h1>
        <p>Personal observations, lessons learned, and reflections gathered through study and life.</p>
      </section>

      <section className="journal-library page-container library-section" aria-label="Journal library">
        {journals.length ? <div className="journal-grid">
          {journals.map((journal) => (
            <article className="journal-card" key={journal.contentSlug}>
              <Link className="journal-card-image" href={`/journals/${journal.contentSlug}`}>
                <Image src={journal.image} alt={journal.title} width={1280} height={853} sizes="(max-width: 720px) 100vw, 50vw" />
              </Link>
              <div className="journal-card-body">
                <p className="content-card-label">{journal.date}</p>
                <h2><Link href={`/journals/${journal.contentSlug}`}>{journal.title}</Link></h2>
                <p>{journal.introduction}</p>
                <Link className="content-card-link" href={`/journals/${journal.contentSlug}`}>Read Entry →</Link>
              </div>
            </article>
          ))}
        </div> : <p className="empty-state">Journal entries will appear here when they are published.</p>}
      </section>

      <style>{`
        .journals-page { background: var(--background); }
        .journals-page .journals-introduction { padding-block: clamp(4.5rem, 8vw, 7rem) clamp(3rem, 5vw, 4.5rem); text-align: center; }
        .journals-page .journals-introduction h1 { margin: .35rem 0 1rem; font-size: clamp(3.2rem, 7vw, 6rem); line-height: .9; letter-spacing: -.035em; }
        .journals-page .journals-introduction > p:last-child { max-width: 42rem; margin-inline: auto; color: var(--muted); font-size: 1rem; line-height: 1.75; }
        .journals-page .journal-library { padding-bottom: clamp(5rem, 9vw, 8rem); }
        .journals-page .journal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1rem, 2.4vw, 1.6rem); }
        .journals-page .journal-card { overflow: hidden; min-width: 0; border: 1px solid var(--line); border-radius: .25rem; background: var(--surface); box-shadow: 0 1rem 2.5rem var(--shadow); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
        .journals-page .journal-card:hover { transform: translateY(-.3rem); border-color: color-mix(in srgb, var(--accent) 52%, var(--line)); box-shadow: 0 1.4rem 3rem var(--shadow); }
        .journals-page .journal-card-image { display: block; aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-muted); }
        .journals-page .journal-card-image img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 450ms ease; }
        .journals-page .journal-card:hover .journal-card-image img { transform: scale(1.025); }
        .journals-page .journal-card-body { padding: 1.5rem; }
        .journals-page .journal-card-body h2 { margin: .45rem 0 .75rem; font-size: clamp(1.6rem, 2.7vw, 2.35rem); line-height: 1; }
        .journals-page .journal-card-body h2 a { text-decoration: none; }
        .journals-page .journal-card-body > p:not(.content-card-label) { margin-bottom: 1.1rem; color: var(--muted); line-height: 1.7; }
        @media (max-width: 680px) { .journals-page .journals-introduction { text-align: left; } .journals-page .journals-introduction > p:last-child { margin-inline: 0; } .journals-page .journal-grid { grid-template-columns: 1fr; } .journals-page .journal-card-body { padding: 1.2rem; } }
      `}</style>
    </main>
  );
}
