import { books } from "@/app/data/books";
import { journals } from "@/app/data/journals";
import { reflections } from "@/app/data/reflections";

export function listPublishedReflections() {
  return reflections;
}

export function getPublishedReflection(slug: string) {
  return reflections.find((reflection) => reflection.contentSlug === slug);
}

export function listPublishedJournals() {
  return journals;
}

export function getPublishedJournal(slug: string) {
  return journals.find((journal) => journal.contentSlug === slug);
}

export function listPublishedBooks() {
  return books;
}

export function getPublishedBook(slug: string) {
  return books.find((book) => book.contentSlug === slug);
}