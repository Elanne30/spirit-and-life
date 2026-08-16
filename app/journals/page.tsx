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
        .journals-page { background: var(--background); padding-bottom: clamp(4rem, 8vw, 7rem); }
        .journals-page .journals-introduction { position: relative; isolation: isolate; width: min(100% - 3rem, 76rem); max-width: none; min-height: 31rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; overflow: hidden; padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem); border-bottom: 1px solid var(--line); text-align: left; }
        .journals-page .journals-introduction::before { position: absolute; z-index: -2; inset: 0; content: ""; background: linear-gradient(90deg, color-mix(in srgb, var(--background) 98%, transparent) 0%, color-mix(in srgb, var(--background) 88%, transparent) 40%, color-mix(in srgb, var(--background) 42%, transparent) 100%), url("/images/journals/on slowing down to read.jpg") center / cover no-repeat; opacity: .9; }
        .journals-page .journals-introduction::after { position: absolute; z-index: -1; inset: 0; content: ""; background: radial-gradient(circle at 78% 48%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 34%); pointer-events: none; }
        .journals-page .journals-introduction .eyebrow { margin-bottom: 1.1rem; }
        .journals-page .journals-introduction h1 { max-width: 18ch; margin: .2rem 0 1.2rem; font-size: clamp(3.7rem, 8vw, 6.8rem); line-height: .88; letter-spacing: -.055em; }
        .journals-page .journals-introduction > p:last-child { max-width: 38rem; margin: 0; color: var(--muted); font-size: 1rem; line-height: 1.7; }
        .journals-page .journal-library { padding-top: clamp(2rem, 4vw, 3rem); }
        .journals-page .journal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1rem, 2.2vw, 1.5rem); }
        .journals-page .journal-card { overflow: hidden; min-width: 0; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); box-shadow: 0 1rem 2.5rem var(--shadow); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
        .journals-page .journal-card:hover { transform: translateY(-.35rem); border-color: color-mix(in srgb, var(--accent) 52%, var(--line)); box-shadow: 0 1.5rem 3rem var(--shadow); }
        .journals-page .journal-card-image { display: block; aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-muted); }
        .journals-page .journal-card-image img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 450ms ease, filter 450ms ease; }
        .journals-page .journal-card:hover .journal-card-image img { transform: scale(1.025); filter: brightness(1.05); }
        .journals-page .journal-card-body { min-height: 14rem; padding: 1.45rem 1.5rem 1.55rem; }
        .journals-page .journal-card-body h2 { margin: .45rem 0 .75rem; font-size: clamp(1.65rem, 2.7vw, 2.35rem); line-height: 1; letter-spacing: -.025em; }
        .journals-page .journal-card-body h2 a { text-decoration: none; }
        .journals-page .journal-card-body > p:not(.content-card-label) { margin-bottom: 1.1rem; color: var(--muted); line-height: 1.7; }
        .journals-page .content-card-link { color: var(--accent-strong); font-size: .76rem; font-weight: 700; }
        html[data-theme="light"] .journals-page .journals-introduction::before { opacity: .58; }
        @media (max-width: 720px) { .journals-page .journals-introduction, .journals-page .journal-library { width: min(100% - 2rem, 40rem); } .journals-page .journals-introduction { min-height: 25rem; padding-block: 4rem 3.5rem; } .journals-page .journals-introduction::before { background: linear-gradient(180deg, color-mix(in srgb, var(--background) 96%, transparent), color-mix(in srgb, var(--background) 74%, transparent)), url("/images/journals/on slowing down to read.jpg") center / cover no-repeat; opacity: .68; } .journals-page .journals-introduction h1 { font-size: clamp(3.3rem, 15vw, 5.2rem); } .journals-page .journal-grid { grid-template-columns: 1fr; max-width: 34rem; margin-inline: auto; } .journals-page .journal-card-body { min-height: auto; padding: 1.2rem; } }
      `}</style>
    </main>
  );
}
