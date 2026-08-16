import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/app/content/seo";
import { listPublishedBooks } from "@/app/content/repository";

export const metadata: Metadata = pageMetadata("Books", "Explore the Spirit & Life digital library and future writing projects.", "/books");

export default async function BooksPage() {
  const books = await listPublishedBooks();
  return (
    <main className="books-page">
      <section className="books-introduction page-container page-intro">
        <div className="books-hero-art" aria-hidden="true" />
        <div className="books-hero-content">
          <p className="eyebrow">The Library</p>
          <h1>Books</h1>
          <p>Published and future writing projects exploring important biblical themes and questions.</p>
          <Link className="books-hero-link" href="#book-library">Browse the Library <span aria-hidden="true">↓</span></Link>
        </div>
      </section>

      <section className="books-library-intro page-container" aria-label="About the book library">
        <div>
          <p className="eyebrow">A quiet place for serious reading</p>
          <h2>Books written to be read slowly.</h2>
        </div>
        <p>These works explore Scripture, theology, Christian thought, and the questions that sit beneath everyday faith. Each title has its own page with its description, details, and available contents.</p>
      </section>

      <section id="book-library" className="book-library page-container library-section" aria-label="Book library">
        {books.length ? <div className="book-grid">
          {books.map((book) => (
            <article className="book-card" key={book.contentSlug}>
              <Link className="book-card-cover" href={`/books/${book.contentSlug}`}>
                {book.cover ? (
                  <Image src={book.cover} alt={`${book.title} cover`} width={853} height={1280} sizes="(max-width: 720px) 75vw, (max-width: 1024px) 38vw, 25vw" />
                ) : (
                  <span className="book-card-cover-missing" aria-label={`${book.title} cover coming soon`}>Cover coming soon</span>
                )}
              </Link>
              <div className="book-card-body">
                <p className="content-card-label">{book.category ?? "Book"}</p>
                <h2><Link href={`/books/${book.contentSlug}`}>{book.title}</Link></h2>
                {book.subtitle ? <p className="book-subtitle">{book.subtitle}</p> : null}
                <Link className="content-card-link" href={`/books/${book.contentSlug}`}>Learn More →</Link>
              </div>
            </article>
          ))}
        </div> : <p className="empty-state">Books will appear here when they are added to the library.</p>}
      </section>

      <section className="books-reading-panel page-container" aria-label="Reading room">
        <div className="books-reading-image">
          <Image src="/images/books/books-library-detail.svg" alt="Open Bible and books in a warm, dark library" width={1200} height={800} />
        </div>
        <div className="books-reading-copy">
          <p className="eyebrow">From the reading room</p>
          <h2>Let the page stay open.</h2>
          <p>A library is not only a collection of titles. It is a place to pause, consider an argument, return to a passage, and allow an idea to be examined carefully.</p>
          <Link className="content-card-link" href="#book-library">Return to the Bookshelf ↑</Link>
        </div>
      </section>

      <style>{`
        .books-page { background: var(--background); padding-bottom: clamp(4rem, 8vw, 7rem); }
        .books-page .books-introduction { position: relative; isolation: isolate; width: min(100% - 3rem, 76rem); max-width: none; min-height: 31rem; display: flex; align-items: center; overflow: hidden; padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem); border-bottom: 1px solid var(--line); text-align: left; }
        .books-page .books-hero-art { position: absolute; z-index: -2; inset: 0; background: linear-gradient(90deg, color-mix(in srgb, var(--background) 97%, transparent) 0%, color-mix(in srgb, var(--background) 88%, transparent) 40%, color-mix(in srgb, var(--background) 38%, transparent) 100%), url("/images/books/books-hero-library.svg") center / cover no-repeat; opacity: .9; }
        .books-page .books-introduction::after { position: absolute; z-index: -1; inset: 0; content: ""; background: radial-gradient(circle at 78% 48%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 35%); pointer-events: none; }
        .books-page .books-hero-content { max-width: 42rem; }
        .books-page .books-introduction .eyebrow { margin-bottom: 1.1rem; }
        .books-page .books-introduction h1 { margin: .2rem 0 1.25rem; font-size: clamp(3.7rem, 8vw, 6.8rem); line-height: .88; letter-spacing: -.055em; }
        .books-page .books-introduction > .books-hero-content > p:not(.eyebrow) { max-width: 37rem; margin-bottom: 1.6rem; color: var(--muted); font-size: 1rem; line-height: 1.7; }
        .books-page .books-hero-link { display: inline-flex; align-items: center; gap: .55rem; color: var(--accent-strong); font-size: .76rem; font-weight: 700; letter-spacing: .04em; text-decoration: none; }
        .books-page .books-hero-link:hover { color: var(--foreground); }
        .books-page .books-library-intro { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: clamp(2rem, 7vw, 6rem); align-items: end; padding-block: clamp(4rem, 7vw, 6rem) 3rem; }
        .books-page .books-library-intro h2 { max-width: 13ch; margin-top: .5rem; font-size: clamp(2.2rem, 4.5vw, 4rem); line-height: .98; letter-spacing: -.04em; }
        .books-page .books-library-intro > p { max-width: 35rem; margin: 0; color: var(--muted); font-size: .92rem; line-height: 1.75; }
        .books-page .book-library { padding-bottom: clamp(4.5rem, 8vw, 7rem); }
        .books-page .book-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(1rem, 2vw, 1.5rem); }
        .books-page .book-card { overflow: hidden; min-width: 0; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); box-shadow: 0 1rem 2.5rem var(--shadow); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
        .books-page .book-card:hover { transform: translateY(-.35rem); border-color: color-mix(in srgb, var(--accent) 52%, var(--line)); box-shadow: 0 1.4rem 3rem var(--shadow); }
        .books-page .book-card-cover { display: block; aspect-ratio: 4 / 5.55; overflow: hidden; background: var(--surface-muted); }
        .books-page .book-card-cover img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 450ms ease, filter 450ms ease; }
        .books-page .book-card:hover .book-card-cover img { transform: scale(1.025); filter: brightness(1.05); }
        .books-page .book-card-cover-missing { display: grid; place-items: center; height: 100%; padding: 2rem; color: var(--muted); font-size: .82rem; text-align: center; }
        .books-page .book-card-body { padding: 1.35rem 1.4rem 1.5rem; }
        .books-page .book-card-body h2 { margin: .45rem 0 .65rem; font-size: clamp(1.45rem, 2.2vw, 2rem); line-height: 1.02; }
        .books-page .book-card-body h2 a { text-decoration: none; }
        .books-page .book-subtitle { margin-bottom: 1rem; color: var(--muted); line-height: 1.55; }
        .books-page .content-card-link { display: inline-flex; margin-top: .25rem; }
        .books-page .books-reading-panel { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, .75fr); gap: 0; overflow: hidden; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); box-shadow: 0 1rem 2.5rem var(--shadow); }
        .books-page .books-reading-image { min-height: 25rem; background: #0b0d0e; }
        .books-page .books-reading-image img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .books-page .books-reading-copy { display: flex; flex-direction: column; justify-content: center; padding: clamp(2rem, 5vw, 4rem); }
        .books-page .books-reading-copy h2 { max-width: 8ch; margin: .55rem 0 1rem; font-size: clamp(2.2rem, 4vw, 3.7rem); line-height: .96; letter-spacing: -.04em; }
        .books-page .books-reading-copy p:not(.eyebrow) { margin-bottom: 1.5rem; color: var(--muted); line-height: 1.75; }
        html[data-theme="light"] .books-page .books-hero-art { opacity: .58; }
        @media (max-width: 900px) { .books-page .book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .books-page .books-library-intro { grid-template-columns: 1fr; gap: 1.5rem; } .books-page .books-reading-panel { grid-template-columns: 1fr; } .books-page .books-reading-image { min-height: 20rem; } }
        @media (max-width: 560px) { .books-page .books-introduction { width: min(100% - 2rem, 40rem); min-height: 25rem; padding-block: 4rem 3.5rem; } .books-page .books-hero-art { background: linear-gradient(180deg, color-mix(in srgb, var(--background) 95%, transparent), color-mix(in srgb, var(--background) 72%, transparent)), url("/images/books/books-hero-library.svg") center / cover no-repeat; opacity: .7; } .books-page .books-introduction h1 { font-size: clamp(3.3rem, 15vw, 5.2rem); } .books-page .books-library-intro, .books-page .book-library { width: min(100% - 2rem, 40rem); } .books-page .book-grid { grid-template-columns: 1fr; max-width: 30rem; margin-inline: auto; } .books-page .books-reading-panel { width: min(100% - 2rem, 40rem); } .books-page .books-reading-image { min-height: 15rem; } .books-page .books-reading-copy { padding: 1.5rem; } }
      `}</style>
    </main>
  );
}
