import { books } from "@/app/data/books";
import { journals } from "@/app/data/journals";
import { reflections } from "@/app/data/reflections";
import { listPublishedDrafts, getPublishedDraft, type ContentDraft, type DraftContentType } from "@/app/lib/content-drafts";
import {
  publishedDraftToReflection,
  publishedDraftToJournal,
  publishedDraftToBook,
} from "@/app/content/published-draft-adapter";

// A published database draft with a matching content type + slug replaces the
// static entry (never duplicates it); brand-new database content is appended.
async function mergePublished<T extends { contentSlug: string }>(
  staticItems: T[],
  contentType: DraftContentType,
  adapt: (draft: ContentDraft) => T | null,
): Promise<T[]> {
  const publishedDrafts = await listPublishedDrafts(contentType);
  const draftsBySlug = new Map(publishedDrafts.map((draft) => [draft.slug, draft]));

  const merged = staticItems.map((item) => {
    const draft = draftsBySlug.get(item.contentSlug);

    if (!draft) {
      return item;
    }

    draftsBySlug.delete(item.contentSlug);
    return adapt(draft) ?? item;
  });

  const additional = Array.from(draftsBySlug.values())
    .map(adapt)
    .filter((item): item is T => item !== null);

  return [...merged, ...additional];
}

export async function listPublishedReflections() {
  return mergePublished(reflections, "reflection", publishedDraftToReflection);
}

export async function getPublishedReflection(slug: string) {
  const draft = await getPublishedDraft("reflection", slug);
  const staticReflection = reflections.find((reflection) => reflection.contentSlug === slug);

  if (draft) {
    return publishedDraftToReflection(draft) ?? staticReflection;
  }

  return staticReflection;
}

export async function listPublishedJournals() {
  return mergePublished(journals, "journal", publishedDraftToJournal);
}

export async function getPublishedJournal(slug: string) {
  const draft = await getPublishedDraft("journal", slug);
  const staticJournal = journals.find((journal) => journal.contentSlug === slug);

  if (draft) {
    return publishedDraftToJournal(draft) ?? staticJournal;
  }

  return staticJournal;
}

export async function listPublishedBooks() {
  return mergePublished(books, "book", publishedDraftToBook);
}

export async function getPublishedBook(slug: string) {
  const draft = await getPublishedDraft("book", slug);
  const staticBook = books.find((book) => book.contentSlug === slug);

  if (draft) {
    return publishedDraftToBook(draft) ?? staticBook;
  }

  return staticBook;
}
