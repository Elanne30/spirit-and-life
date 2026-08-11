import { books } from "@/app/data/books";
import { reflections } from "@/app/data/reflections";

export function getFeaturedReflection() {
  return reflections.find((reflection) => reflection.featured) ?? reflections[0];
}

export function getFeaturedBook() {
  return books.find((book) => book.featured) ?? books[0];
}
