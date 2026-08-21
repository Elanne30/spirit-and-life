import Link from "next/link";
import { studies } from "@/app/data/study-plan";
import { scriptureReferences } from "@/app/content/scripture";
import { listPublishedArticles } from "@/app/lib/content-drafts";
import { listPublishedBooks, listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { QUESTIONS } from "@/app/lib/questions";
import { listPodcastEpisodes } from "@/app/lib/podcast-repository";
import { listDownloadableResources } from "@/app/lib/resource-repository";
import type { ContentRelations } from "@/app/content/types";

type RelatedItem = { href: string; label: string; title: string; description?: string; meta?: string };
type RelatedContentProps = { relations: ContentRelations; scriptureReference?: string; scriptureSlugs?: string[] };

export async function RelatedContent({ relations, scriptureReference, scriptureSlugs = [] }: RelatedContentProps) {
  const [articles, books, journals, reflections, podcasts, resources] = await Promise.all([
    listPublishedArticles(), listPublishedBooks(), listPublishedJournals(), listPublishedReflections(), listPodcastEpisodes(true), listDownloadableResources(true),
  ]);
  const scriptureItems = [
    ...scriptureSlugs.map((slug) => scriptureReferences.find((reference) => reference.slug === slug)),
    ...(scriptureReference ? scriptureReferences.filter((reference) => reference.reference === scriptureReference) : []),
  ].filter((reference): reference is (typeof scriptureReferences)[number] => Boolean(reference)).map((reference) => ({ href: `/scripture/${reference.slug}`, label: "Scripture", title: reference.reference, description: reference.summary, meta: `${reference.book} · Chapter ${reference.chapter}` }));

  const explicitItems: RelatedItem[] = [
    ...(relations.relatedArticleSlugs ?? []).map((slug) => articles.find((article) => article.slug === slug)).filter((article): article is (typeof articles)[number] => Boolean(article)).map((article) => ({ href: `/articles/${article.slug}`, label: "Article", title: article.title, description: article.introduction ?? undefined, meta: article.category ?? "Article" })),
    ...(relations.relatedReflectionSlugs ?? []).map((slug) => reflections.find((reflection) => reflection.contentSlug === slug)).filter((reflection): reflection is (typeof reflections)[number] => Boolean(reflection)).map((reflection) => ({ href: `/reflections/${reflection.contentSlug}`, label: "Reflection", title: reflection.title, description: reflection.introduction, meta: [reflection.date, reflection.readingTime, reflection.scripture].filter(Boolean).join(" · ") })),
    ...(relations.relatedJournalSlugs ?? []).map((slug) => journals.find((journal) => journal.contentSlug === slug)).filter((journal): journal is (typeof journals)[number] => Boolean(journal)).map((journal) => ({ href: `/journals/${journal.contentSlug}`, label: "Journal", title: journal.title, description: journal.introduction, meta: journal.date })),
    ...(relations.relatedBookSlugs ?? []).map((slug) => books.find((book) => book.contentSlug === slug)).filter((book): book is (typeof books)[number] => Boolean(book)).map((book) => ({ href: `/books/${book.contentSlug}`, label: "Book", title: book.title, description: book.description?.split("\n\n")[0], meta: book.category ?? book.status })),
    ...(relations.relatedQuestionSlugs ?? []).map((slug) => QUESTIONS.find((question) => question.slug === slug)).filter((question): question is (typeof QUESTIONS)[number] => Boolean(question)).map((question) => ({ href: `/questions/${question.slug}`, label: "Question", title: question.question, description: question.description, meta: "Explore the question" })),
    ...(relations.relatedPodcastSlugs ?? []).map((slug) => podcasts.find((podcast) => podcast.slug === slug)).filter((podcast): podcast is (typeof podcasts)[number] => Boolean(podcast)).map((podcast) => ({ href: `/podcast/${podcast.slug}`, label: "Podcast", title: podcast.title, description: podcast.description, meta: [podcast.publishedAt, podcast.duration].filter(Boolean).join(" · ") })),
    ...(relations.relatedResourceSlugs ?? []).map((slug) => resources.find((resource) => resource.slug === slug)).filter((resource): resource is (typeof resources)[number] => Boolean(resource)).map((resource) => ({ href: `/resources/${resource.slug}`, label: "Resource", title: resource.title, description: resource.description, meta: resource.kind })),
    ...scriptureItems,
    ...(relations.relatedStudyPlanDates ?? []).map((date) => studies.find((study) => study.date === date)).filter((study): study is (typeof studies)[number] => Boolean(study)).map((study) => ({ href: `/study-center/${study.date}`, label: "Study Plan", title: `${study.weekday}, ${study.date}`, description: study.focus, meta: study.passage })),
  ];

  const fallbackItems: RelatedItem[] = [
    ...articles.slice(0, 1).map((article) => ({ href: `/articles/${article.slug}`, label: "Article", title: article.title, description: article.introduction ?? undefined, meta: article.category ?? "Article" })),
    ...reflections.slice(0, 2).map((reflection) => ({ href: `/reflections/${reflection.contentSlug}`, label: "Reflection", title: reflection.title, description: reflection.introduction, meta: [reflection.date, reflection.readingTime, reflection.scripture].filter(Boolean).join(" · ") })),
    ...journals.slice(0, 1).map((journal) => ({ href: `/journals/${journal.contentSlug}`, label: "Journal", title: journal.title, description: journal.introduction, meta: journal.date })),
    ...podcasts.slice(0, 1).map((podcast) => ({ href: `/podcast/${podcast.slug}`, label: "Podcast", title: podcast.title, description: podcast.description, meta: [podcast.publishedAt, podcast.duration].filter(Boolean).join(" · ") })),
    ...resources.slice(0, 1).map((resource) => ({ href: `/resources/${resource.slug}`, label: "Resource", title: resource.title, description: resource.description, meta: resource.kind })),
    ...books.slice(0, 1).map((book) => ({ href: `/books/${book.contentSlug}`, label: "Book", title: book.title, description: book.description?.split("\n\n")[0], meta: book.category ?? book.status })),
    ...scriptureItems,
  ];

  const relatedItems = explicitItems.length ? explicitItems : fallbackItems;
  const uniqueItems = relatedItems.filter((item, index) => relatedItems.findIndex((candidate) => candidate.href === item.href) === index).slice(0, 6);
  if (uniqueItems.length === 0) return null;

  return <section className="related-content" aria-labelledby="related-content-title"><p className="eyebrow">Continue exploring</p><h2 id="related-content-title">Related material</h2><div className="related-content-grid">{uniqueItems.map((item) => <article className="related-content-card" key={item.href}><p className="content-card-label">{item.label}</p><h3><Link href={item.href}>{item.title}</Link></h3>{item.meta ? <p className="related-content-meta">{item.meta}</p> : null}{item.description ? <p>{item.description}</p> : null}<Link className="content-card-link" href={item.href}>Open {item.label} →</Link></article>)}</div></section>;
}
