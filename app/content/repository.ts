import { books } from "@/app/data/books";
import { journals } from "@/app/data/journals";
import { reflections } from "@/app/data/reflections";
import { listPublishedDrafts, getPublishedDraft } from "@/app/lib/content-drafts";
import { publishedDraftToReflection } from "@/app/content/published-draft-adapter";

export async function listPublishedReflections() {
  const publishedDrafts = await listPublishedDrafts("reflection");

  const databaseReflections = publishedDrafts
    .map(publishedDraftToReflection)
    .filter((reflection): reflection is NonNullable<typeof reflection> => reflection !== null);

  return [...reflections, ...databaseReflections];
}

export async function getPublishedReflection(slug: string) {
  const staticReflection = reflections.find(
    (reflection) => reflection.contentSlug === slug,
  );

  if (staticReflection) {
    return staticReflection;
  }

  const draft = await getPublishedDraft("reflection", slug);
  return draft ? publishedDraftToReflection(draft) : undefined;
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
