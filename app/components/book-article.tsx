import Image from "next/image";
import Link from "next/link";
import { RelatedContent } from "@/app/components/related-content";
import type { Book } from "@/app/data/books";

// Shared with the admin preview so it never drifts from the public page.
export function BookArticle({ book, showBackLink = true }: { book: Book; showBackLink?: boolean }) {
  return (
    <main className="book-detail-page">
      <article className="book-detail page-container">
        <div className="book-detail-cover">
          {book.cover ? <Image src={book.cover} alt={`${book.title} cover`} width={853} height={1280} priority sizes="(max-width: 720px) 75vw, 28rem" /> : <div className="book-detail-cover-missing" role="img" aria-label={`${book.title} cover coming soon`}><span>Cover coming soon</span></div>}
        </div>
        <div className="book-detail-content">
          <p className="eyebrow">Book</p>
          <h1>{book.title}</h1>
          {book.subtitle ? <p className="book-subtitle">{book.subtitle}</p> : null}
          <p className="book-status">{book.status}</p>
          {book.expectedPublication ? <p className="book-detail-meta">Expected publication: {book.expectedPublication}</p> : null}
          {book.author ? <p className="book-detail-meta">Author: {book.author}</p> : null}
          {book.publisher ? <p className="book-detail-meta">Publisher/site label: {book.publisher}</p> : null}
          {book.length ? <p className="book-detail-meta">Length: {book.length}</p> : null}
          {book.description ? <div className="book-detail-description">{book.description.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div> : null}
          {book.tableOfContents ? <div className="book-detail-contents"><h2>Table of Contents</h2><ul>{book.tableOfContents.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
          <p className="book-detail-notice">This book is currently in preparation and is not yet available to read.</p>
          {showBackLink ? <Link className="button button-text" href="/books">Back to Books</Link> : null}
          <RelatedContent relations={book} />
        </div>
      </article>
      <style>{`
        .book-detail-page { background: var(--background); }
        .book-detail-page .book-detail { display: grid; grid-template-columns: minmax(15rem, 27rem) minmax(0, 1fr); align-items: start; gap: clamp(2.5rem, 7vw, 7rem); padding-block: clamp(4.5rem, 8vw, 7rem); }
        .book-detail-page .book-detail-cover { position: sticky; top: 2rem; display: flex; justify-content: center; }
        .book-detail-page .book-detail-cover img { width: min(100%, 27rem); height: auto; display: block; border: 1px solid var(--line); box-shadow: 0 1.5rem 3.5rem var(--shadow); }
        .book-detail-page .book-detail-cover-missing { width: min(100%, 27rem); aspect-ratio: 4 / 5.55; display: grid; place-items: center; border: 1px solid var(--line); background: var(--surface); color: var(--muted); text-align: center; }
        .book-detail-page .book-detail-content { max-width: 46rem; padding-top: .5rem; }
        .book-detail-page .book-detail-content h1 { margin: .4rem 0 .8rem; font-size: clamp(2.7rem, 6vw, 5.6rem); line-height: .9; letter-spacing: -.035em; }
        .book-detail-page .book-subtitle { margin-bottom: 1.1rem; color: var(--muted); font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.5; }
        .book-detail-page .book-status { display: inline-flex; width: fit-content; margin-bottom: 1.3rem; padding: .4rem .65rem; border: 1px solid var(--line); border-radius: 999px; color: var(--accent); font-size: .75rem; font-weight: 700; }
        .book-detail-page .book-detail-meta { margin: .35rem 0; color: var(--muted); font-size: .85rem; }
        .book-detail-page .book-detail-description { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--line); }
        .book-detail-page .book-detail-description p { margin-bottom: 1rem; color: var(--muted); line-height: 1.85; }
        .book-detail-page .book-detail-contents { margin-top: 2rem; padding: 1.4rem; border: 1px solid var(--line); border-radius: .2rem; background: var(--surface); }
        .book-detail-page .book-detail-contents h2 { margin-bottom: .9rem; font-size: 1.4rem; }
        .book-detail-page .book-detail-contents ul { margin: 0; padding-left: 1.2rem; color: var(--muted); line-height: 1.8; }
        .book-detail-page .book-detail-notice { margin: 1.5rem 0; padding: 1rem; border-left: 2px solid var(--accent); background: var(--surface); color: var(--muted); line-height: 1.6; }
        @media (max-width: 760px) { .book-detail-page .book-detail { grid-template-columns: 1fr; gap: 2.5rem; padding-block: 3.5rem 5rem; } .book-detail-page .book-detail-cover { position: static; } .book-detail-page .book-detail-cover img, .book-detail-page .book-detail-cover-missing { width: min(72vw, 19rem); } .book-detail-page .book-detail-content h1 { font-size: clamp(2.7rem, 13vw, 4.5rem); } }
      `}</style>
    </main>
  );
}
