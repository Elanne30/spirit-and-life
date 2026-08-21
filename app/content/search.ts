"use server";

import { scriptureReferences } from "@/app/content/scripture";
import { listPublishedBooks, listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { listPublishedArticles } from "@/app/lib/content-drafts";
import { studies } from "@/app/data/study-plan";
import { TOPICS, SERIES } from "@/app/lib/content-taxonomy";
import { QUESTIONS } from "@/app/lib/questions";
import type { SearchResult, SearchType } from "@/app/content/search-types";

export type { SearchResult, SearchType } from "@/app/content/search-types";

type IndexedSearchResult = SearchResult & { searchText: string };

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

async function buildSearchIndex(): Promise<IndexedSearchResult[]> {
  const articles = await listPublishedArticles();
  const reflections = await listPublishedReflections();
  const journals = await listPublishedJournals();
  const books = await listPublishedBooks();

  return [
    ...articles.map((article): IndexedSearchResult => ({ type: "Article", title: article.title, description: article.introduction ?? `${article.category ?? "Article"} - Spirit & Life`, href: `/articles/${article.slug}`, meta: [typeof article.body.date === "string" ? article.body.date : "", typeof article.body.readingTime === "string" ? article.body.readingTime : "", article.category ?? ""].filter(Boolean).join(" · "), searchText: ["Article", article.title, article.category ?? "", ...(article.tags ?? []), article.introduction ?? "", typeof article.body.scripture === "string" ? article.body.scripture : "", typeof article.body.date === "string" ? article.body.date : "", typeof article.body.readingTime === "string" ? article.body.readingTime : "", ...((Array.isArray(article.body.sections) ? article.body.sections : []).flatMap((section) => { if (!section || typeof section !== "object") return []; const value = section as { heading?: unknown; paragraphs?: unknown }; return [typeof value.heading === "string" ? value.heading : "", ...(Array.isArray(value.paragraphs) ? value.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string") : [])]; }))].join(" ") })),
    ...reflections.map((reflection): IndexedSearchResult => ({ type: "Reflection", title: reflection.title, description: `${reflection.category} - ${reflection.introduction}`, href: `/reflections/${reflection.contentSlug}`, meta: [reflection.date, reflection.readingTime, reflection.scripture].filter(Boolean).join(" · "), searchText: [reflection.type, reflection.title, reflection.category, ...(reflection.tags ?? []), reflection.scripture, reflection.introduction, ...reflection.sections.map((section) => section.heading), ...reflection.sections.flatMap((section) => section.paragraphs)].join(" ") })),
    ...journals.map((journal): IndexedSearchResult => ({ type: "Journal", title: journal.title, description: journal.introduction, href: `/journals/${journal.contentSlug}`, meta: [journal.date, journal.label].filter(Boolean).join(" · "), searchText: [journal.type, journal.title, journal.label, journal.date, journal.introduction, ...journal.sections.map((section) => section.heading), ...journal.sections.flatMap((section) => section.paragraphs)].join(" ") })),
    ...books.map((book): IndexedSearchResult => ({ type: "Book", title: book.title, description: book.description ?? `${book.status} - Spirit & Life digital library`, href: `/books/${book.contentSlug}`, meta: [book.category, book.status, book.expectedPublication].filter(Boolean).join(" · "), searchText: [book.type, book.title, book.subtitle ?? "", book.category ?? "", book.status, book.expectedPublication ?? "", book.author ?? "", book.publisher ?? "", book.length ?? "", book.description ?? "", ...(book.tableOfContents ?? [])].join(" ") })),
    ...scriptureReferences.map((reference): IndexedSearchResult => ({ type: "Scripture", title: reference.reference, description: reference.summary, href: `/scripture/${reference.slug}`, meta: `${reference.book} · Chapter ${reference.chapter}`, searchText: ["Scripture", reference.reference, reference.book, String(reference.chapter), reference.passage, reference.summary].join(" ") })),
    ...studies.map((study): IndexedSearchResult => ({ type: "Study Center", title: `${study.weekday}, ${study.date}`, description: `${study.weekTitle ?? "Study"} - ${study.passage}`, href: `/study-center/${study.date}`, meta: study.passage, searchText: ["Study Center", study.kind, study.weekday, study.date, study.weekTitle ?? "", study.movement ?? "", study.passage, study.focus, study.reflection ?? "", ...(study.retreatQuestions ?? []), study.prayerPrompt ?? ""].join(" ") })),
    ...TOPICS.map((topic): IndexedSearchResult => ({ type: "Topic", title: topic.name, description: topic.description ?? `Explore writing and resources about ${topic.name}.`, href: `/topics/${topic.slug}`, searchText: ["Topic", topic.name, topic.description ?? ""].join(" ") })),
    ...SERIES.map((series): IndexedSearchResult => ({ type: "Series", title: series.name, description: series.description ?? "A connected series of Christian writing and resources.", href: `/series/${series.slug}`, meta: series.topicSlugs?.join(" · "), searchText: ["Series", series.name, series.description ?? "", ...(series.topicSlugs ?? [])].join(" ") })),
    ...QUESTIONS.map((question): IndexedSearchResult => ({ type: "Question", title: question.question, description: question.description ?? "A question explored through Christian thought and Scripture.", href: `/questions/${question.slug}`, meta: question.seriesSlug ?? "", searchText: ["Question", question.question, question.description ?? "", ...(question.topicSlugs ?? []), question.seriesSlug ?? ""].join(" ") })),
  ];
}

export async function searchContent(query: string, type: SearchType = "All"): Promise<SearchResult[]> {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];
  const searchIndex = await buildSearchIndex();
  const queryTokens = normalizedQuery.split(" ");
  return searchIndex
    .filter((result) => type === "All" || result.type === type)
    .map((result) => {
      const normalizedTitle = normalizeSearchText(result.title);
      const normalizedType = normalizeSearchText(result.type);
      const normalizedDescription = normalizeSearchText(result.description);
      const normalizedSearchText = normalizeSearchText(result.searchText);
      const containsWholeQuery = normalizedSearchText.includes(normalizedQuery);
      const tokenMatches = queryTokens.every((token) => normalizedSearchText.includes(token));
      if (!containsWholeQuery && !tokenMatches) return null;
      let score = 0;
      if (normalizedTitle === normalizedQuery) score += 220;
      if (normalizedTitle.startsWith(normalizedQuery)) score += 160;
      if (normalizedTitle.includes(normalizedQuery)) score += 100;
      if (normalizedType.includes(normalizedQuery)) score += 95;
      if (normalizedDescription.includes(normalizedQuery)) score += 60;
      if (containsWholeQuery) score += 40;
      for (const token of queryTokens) { if (normalizedTitle.includes(token)) score += 14; if (normalizedType.includes(token)) score += 10; if (normalizedDescription.includes(token)) score += 6; }
      return { result, score };
    })
    .filter((item): item is { result: IndexedSearchResult; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map(({ result }) => ({ type: result.type, title: result.title, description: result.description, href: result.href, meta: result.meta }))
    .filter((result, index, results) => results.findIndex((candidate) => candidate.href === result.href) === index);
}
