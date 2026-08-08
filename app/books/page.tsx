import Image from "next/image";
import Link from "next/link";
import { books } from "@/app/data/books";

export default function BooksPage() {
  return (
    <main className="books-page">
      <section className="books-introduction page-container">
        <p className="eyebrow">Books</p>
        <h1>A digital library for thoughtful reading</h1>
        <p>
          Books are being prepared as part of the connected Spirit &amp; Life
          reading experience.
        </p>
      </section>

      <section className="book-library page-container" aria-labelledby="book-library-title">
        <div className="book-library-heading">
          <p className="eyebrow">The library</p>
          <h2 id="book-library-title">Books in preparation.</h2>
        </div>
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
                <p className="content-card-label">Book</p>
                <h2>
                  <Link href={`/books/${book.contentSlug}`}>{book.title}</Link>
                </h2>
                {book.subtitle ? <p className="book-subtitle">{book.subtitle}</p> : null}
                <p className="book-status">{book.status}</p>
                <Link className="content-card-link" href={`/books/${book.contentSlug}`}>
                  View Book
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
