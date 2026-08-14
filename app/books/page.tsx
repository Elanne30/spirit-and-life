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
        <div className="book-grid">
          {books.map((book) => (
            <article className="book-card" key={book.contentSlug}>
              <Link className="book-card-cover" href={`/books/${book.contentSlug}`}>
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover`}
                    width={853}
                    height={1280}
                    sizes="(max-width: 720px) 75vw, (max-width: 1024px) 38vw, 25vw"
                  />
                ) : (
                  <span className="book-card-cover-missing" aria-label={`${book.title} cover coming soon`}>
                    Cover coming soon
                  </span>
                )}
              </Link>
              <div className="book-card-body">
                <p className="content-card-label">{book.category ?? "Book"}</p>
                <h2>
                  <Link href={`/books/${book.contentSlug}`}>{book.title}</Link>
                </h2>
                {book.subtitle ? <p className="book-subtitle">{book.subtitle}</p> : null}
                <Link className="content-card-link" href={`/books/${book.contentSlug}`}>
                  Learn More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
