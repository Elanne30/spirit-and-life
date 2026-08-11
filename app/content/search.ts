import { books } from "@/app/data/books";
import { journals } from "@/app/data/journals";
import { reflections } from "@/app/data/reflections";
import { scriptureReferences } from "@/app/content/scripture";

export type SearchResult = {
  type: "Reflection" | "Journal" | "Book" | "Scripture";
  title: string;
  description: string;
  href: string;
};

const searchIndex: SearchResult[] = [
  ...reflections.map((reflection) => ({
    type: "Reflection" as const,
    title: reflection.title,
    description: `${reflection.category} - ${reflection.introduction}`,
    href: `/reflections/${reflection.contentSlug}`,
  })),
  ...journals.map((journal) => ({
    type: "Journal" as const,
    title: journal.title,
    description: journal.introduction,
    href: `/journals/${journal.contentSlug}`,
  })),
  ...books.map((book) => ({
    type: "Book" as const,
    title: book.title,
    description: book.description ?? `${book.status} - Spirit & Life digital library`,
    href: `/books/${book.contentSlug}`,
  })),
  ...scriptureReferences.map((reference) => ({
    type: "Scripture" as const,
    title: reference.reference,
    description: reference.summary,
    href: `/scripture/${reference.slug}`,
  })),
];

export function searchContent(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return searchIndex.filter((result) =>
    `${result.type} ${result.title} ${result.description}`.toLowerCase().includes(normalizedQuery),
  );
}
