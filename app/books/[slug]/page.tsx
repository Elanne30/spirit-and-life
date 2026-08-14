import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookArticle } from "@/app/components/book-article";
import { pageMetadata } from "@/app/content/seo";
import { getPublishedBook, listPublishedBooks } from "@/app/content/repository";

export async function generateStaticParams() {
  const books = await listPublishedBooks();
  return books.map((book) => ({ slug: book.contentSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await getPublishedBook(slug);
  return book ? pageMetadata(book.title, book.description ?? `${book.title} in the Spirit & Life digital library.`, `/books/${book.contentSlug}`) : pageMetadata("Books", "Explore the Spirit & Life digital library.", "/books");
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getPublishedBook(slug);

  if (!book) {
    notFound();
  }

  return <BookArticle book={book} />;
}
