import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedContent } from "@/app/components/related-content";
import { pageMetadata } from "@/app/content/seo";
import { getPublishedBook, listPublishedBooks } from "@/app/content/repository";

export function generateStaticParams() {
  return listPublishedBooks().map((book) => ({ slug: book.contentSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = getPublishedBook(slug);
  return book ? pageMetadata(book.title, book.description ?? `${book.title} in the Spirit & Life digital library.`, `/books/${book.contentSlug}`) : pageMetadata("Books", "Explore the Spirit & Life digital library.", "/books");
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getPublishedBook(slug);

  if (!book) {
    notFound();
  }

  return (
    <main className="book-detail-page">
      <article className="book-detail page-container">
        <div className="book-detail-cover">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={`${book.title} cover`}
              width={853}
              height={1280}
              priority
              sizes="(max-width: 720px) 75vw, 28rem"
            />
          ) : (
            <div className="book-detail-cover-missing" role="img" aria-label={`${book.title} cover coming soon`}>
              <span>Cover coming soon</span>
            </div>
          )}
        </div>
        <div className="book-detail-content">
          <p className="eyebrow">Book</p>
          <h1>{book.title}</h1>
          {book.subtitle ? <p className="book-subtitle">{book.subtitle}</p> : null}
          <p className="book-status">{book.status}</p>
          {book.expectedPublication ? (
            <p className="book-detail-meta">Expected publication: {book.expectedPublication}</p>
          ) : null}
          {book.author ? <p className="book-detail-meta">Author: {book.author}</p> : null}
          {book.publisher ? <p className="book-detail-meta">Publisher/site label: {book.publisher}</p> : null}
          {book.length ? <p className="book-detail-meta">Length: {book.length}</p> : null}
          {book.description ? (
            <div className="book-detail-description">
              {book.description.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ) : null}
          {book.tableOfContents ? (
            <div className="book-detail-contents">
              <h2>Table of Contents</h2>
              <ul>
                {book.tableOfContents.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}
          <p className="book-detail-notice">
            This book is currently in preparation and is not yet available to read.
          </p>
          <Link className="button button-text" href="/books">
            Back to Books
          </Link>
          <RelatedContent relations={book} />
        </div>
      </article>
    </main>
  );
}
