import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookArticle } from "@/app/components/book-article";
import { pageMetadata } from "@/app/content/seo";
import { getPublishedBook, listPublishedBooks } from "@/app/content/repository";
import { siteConfig } from "@/app/content/site-config";

export async function generateStaticParams() {
  const books = await listPublishedBooks();
  return books.map((book) => ({ slug: book.contentSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await getPublishedBook(slug);
  return book ? pageMetadata(book.title, book.description ?? `${book.title} in the Spirit & Life digital library.`, `/books/${book.contentSlug}`, book.cover) : pageMetadata("Books", "Explore the Spirit & Life digital library.", "/books");
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getPublishedBook(slug);
  if (!book) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    ...(book.description ? { description: book.description } : {}),
    ...(book.author ? { author: { "@type": "Person", name: book.author } } : {}),
    ...(book.publisher ? { publisher: { "@type": "Organization", name: book.publisher } } : {}),
    ...(book.cover ? { image: new URL(book.cover, siteConfig.url).toString() } : {}),
    url: new URL(`/books/${book.contentSlug}`, siteConfig.url).toString(),
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <BookArticle book={book} />
  </>;
}
