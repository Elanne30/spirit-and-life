import { listPublishedBooks, listPublishedReflections } from "@/app/content/repository";

export function getFeaturedReflection() {
  const reflections = listPublishedReflections();
  return reflections.find((reflection) => reflection.featured) ?? reflections[0];
}

export function getFeaturedBook() {
  const books = listPublishedBooks();
  return books.find((book) => book.featured) ?? books[0];
}
