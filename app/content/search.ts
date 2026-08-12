import { scriptureReferences } from "@/app/content/scripture";
import { listPublishedBooks, listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { studies } from "@/app/data/study-plan";

export type SearchResult = {
  type: "Reflection" | "Journal" | "Book" | "Scripture" | "Study Center";
  title: string;
  description: string;
  href: string;
};

type IndexedSearchResult = SearchResult & {
  searchText: string;
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const searchIndex: IndexedSearchResult[] = [
  ...listPublishedReflections().map((reflection): IndexedSearchResult => ({
    type: "Reflection" as const,
    title: reflection.title,
    description: `${reflection.category} - ${reflection.introduction}`,
    href: `/reflections/${reflection.contentSlug}`,
    searchText: [
      reflection.type,
      reflection.title,
      reflection.category,
      ...(reflection.tags ?? []),
      reflection.scripture,
      reflection.introduction,
      ...reflection.sections.map((section) => section.heading),
      ...reflection.sections.flatMap((section) => section.paragraphs),
    ].join(" "),
  })),
  ...listPublishedJournals().map((journal): IndexedSearchResult => ({
    type: "Journal" as const,
    title: journal.title,
    description: journal.introduction,
    href: `/journals/${journal.contentSlug}`,
    searchText: [
      journal.type,
      journal.title,
      journal.label,
      journal.date,
      journal.introduction,
      ...journal.sections.map((section) => section.heading),
      ...journal.sections.flatMap((section) => section.paragraphs),
    ].join(" "),
  })),
  ...listPublishedBooks().map((book): IndexedSearchResult => ({
    type: "Book" as const,
    title: book.title,
    description: book.description ?? `${book.status} - Spirit & Life digital library`,
    href: `/books/${book.contentSlug}`,
    searchText: [
      book.type,
      book.title,
      book.subtitle ?? "",
      book.category ?? "",
      book.status,
      book.expectedPublication ?? "",
      book.author ?? "",
      book.publisher ?? "",
      book.length ?? "",
      book.description ?? "",
      ...(book.tableOfContents ?? []),
    ].join(" "),
  })),
  ...scriptureReferences.map((reference): IndexedSearchResult => ({
    type: "Scripture" as const,
    title: reference.reference,
    description: reference.summary,
    href: `/scripture/${reference.slug}`,
    searchText: [
      "Scripture",
      reference.reference,
      reference.book,
      String(reference.chapter),
      reference.passage,
      reference.summary,
    ].join(" "),
  })),
  ...studies.map((study): IndexedSearchResult => ({
    type: "Study Center" as const,
    title: `${study.weekday}, ${study.date}`,
    description: `${study.weekTitle ?? "Study"} - ${study.passage}`,
    href: `/study-center/${study.date}`,
    searchText: [
      "Study Center",
      study.kind,
      study.weekday,
      study.date,
      study.weekTitle ?? "",
      study.movement ?? "",
      study.passage,
      study.focus,
      study.reflection ?? "",
      ...(study.retreatQuestions ?? []),
      study.prayerPrompt ?? "",
    ].join(" "),
  })),
];

export function searchContent(query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  const queryTokens = normalizedQuery.split(" ");

  return searchIndex
    .map((result) => {
      const normalizedTitle = normalizeSearchText(result.title);
      const normalizedType = normalizeSearchText(result.type);
      const normalizedDescription = normalizeSearchText(result.description);
      const normalizedSearchText = normalizeSearchText(result.searchText);

      const containsWholeQuery = normalizedSearchText.includes(normalizedQuery);
      const tokenMatches = queryTokens.every((token) => normalizedSearchText.includes(token));

      if (!containsWholeQuery && !tokenMatches) {
        return null;
      }

      let score = 0;
      if (normalizedTitle === normalizedQuery) score += 220;
      if (normalizedTitle.startsWith(normalizedQuery)) score += 160;
      if (normalizedTitle.includes(normalizedQuery)) score += 100;
      if (normalizedType.includes(normalizedQuery)) score += 95;
      if (normalizedDescription.includes(normalizedQuery)) score += 60;
      if (containsWholeQuery) score += 40;

      for (const token of queryTokens) {
        if (normalizedTitle.includes(token)) score += 14;
        if (normalizedType.includes(token)) score += 10;
        if (normalizedDescription.includes(token)) score += 6;
      }

      return { result, score };
    })
    .filter((item): item is { result: IndexedSearchResult; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map(({ result }) => ({
      type: result.type,
      title: result.title,
      description: result.description,
      href: result.href,
    }));
}
