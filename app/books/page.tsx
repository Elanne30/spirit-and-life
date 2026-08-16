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
        <p className="eyebrow">The Library</p>
        <h1>Books</h1>
        <p>Published and future writing projects exploring important biblical themes and questions.</p>
      </section>

      <section className="book-library page-container library-section" aria-label="Book library">
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

      <style>{`
        .books-page { background: var(--background); }
        .books-page .books-introduction { padding-block: clamp(4.5rem, 8vw, 7rem) clamp(3rem, 5vw, 4.5rem); text-align: center; }
        .books-page .books-introduction h1 { margin: .35rem 0 1rem; font-size: clamp(3.2rem, 7vw, 6rem); line-height: .9; letter-spacing: -.035em; }
        .books-page .books-introduction > p:last-child { max-width: 42rem; margin-inline: auto; color: var(--muted); font-size: 1rem; line-height: 1.75; }
        .books-page .book-library { padding-bottom: clamp(5rem, 9vw, 8rem); }
        .books-page .book-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(1rem, 2vw, 1.5rem); }
        .books-page .book-card { overflow: hidden; min-width: 0; border: 1px solid var(--line); border-radius: .25rem; background: var(--surface); box-shadow: 0 1rem 2.5rem var(--shadow); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
        .books-page .book-card:hover { transform: translateY(-.35rem); border-color: color-mix(in srgb, var(--accent) 52%, var(--line)); box-shadow: 0 1.4rem 3rem var(--shadow); }
        .books-page .book-card-cover { display: block; aspect-ratio: 4 / 5.55; overflow: hidden; background: var(--surface-muted); }
        .books-page .book-card-cover img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 450ms ease; }
        .books-page .book-card:hover .book-card-cover img { transform: scale(1.025); }
        .books-page .book-card-cover-missing { display: grid; place-items: center; height: 100%; padding: 2rem; color: var(--muted); font-size: .82rem; text-align: center; }
        .books-page .book-card-body { padding: 1.35rem 1.4rem 1.5rem; }
        .books-page .book-card-body h2 { margin: .45rem 0 .65rem; font-size: clamp(1.45rem, 2.2vw, 2rem); line-height: 1.02; }
        .books-page .book-card-body h2 a { text-decoration: none; }
        .books-page .book-subtitle { margin-bottom: 1rem; color: var(--muted); line-height: 1.55; }
        .books-page .content-card-link { display: inline-flex; margin-top: .25rem; }
        @media (max-width: 900px) { .books-page .book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 560px) { .books-page .books-introduction { text-align: left; } .books-page .books-introduction > p:last-child { margin-inline: 0; } .books-page .book-grid { grid-template-columns: 1fr; max-width: 30rem; margin-inline: auto; } .books-page .book-card-body { padding: 1.2rem; } }
      `}</style>
    </main>
  );
}
