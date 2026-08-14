import { listPublishedBooks, listPublishedReflections } from "@/app/content/repository";

export async function getFeaturedReflection() {
  const reflections = await listPublishedReflections();
  return reflections.find((reflection) => reflection.featured) ?? reflections[0];
}

export function getFeaturedBook() {
  const books = listPublishedBooks();
  return books.find((book) => book.featured) ?? books[0];
}
