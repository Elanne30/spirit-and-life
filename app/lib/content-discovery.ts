import { getSeries, getTopic, TOPICS, SERIES, type Series, type Topic } from "@/app/lib/content-taxonomy";
import { QUESTIONS, type Question } from "@/app/lib/questions";
import { listPublishedArticles, type ArticleDraft } from "@/app/lib/content-drafts";

export type DiscoveryTaxonomy = {
  topics: readonly Topic[];
  series: readonly Series[];
  questions: readonly Question[];
};

export function getDiscoveryTaxonomy(): DiscoveryTaxonomy {
  return { topics: TOPICS, series: SERIES, questions: QUESTIONS };
}

function bodyStringList(article: ArticleDraft, key: string) {
  const value = article.body[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function articleMatchesTopic(article: ArticleDraft, slug: string) {
  return article.topics.includes(slug) || bodyStringList(article, "topics").includes(slug);
}

function articleMatchesSeries(article: ArticleDraft, slug: string) {
  return article.series === slug || (typeof article.body.series === "string" && article.body.series === slug);
}

function articleMatchesQuestion(article: ArticleDraft, slug: string) {
  return bodyStringList(article, "relatedQuestionSlugs").includes(slug);
}

function articlePartNumber(article: ArticleDraft) {
  const explicit = article.body.seriesOrder;
  if (typeof explicit === "number" && Number.isFinite(explicit)) return explicit;
  if (typeof explicit === "string" && /^\d+$/.test(explicit.trim())) return Number(explicit.trim());

  const match = article.title.match(/\bpart\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/i);
  if (!match) return 1;
  const value = match[1].toLowerCase();
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  return words[value] ?? Number(value);
}

function orderSeriesArticles(articles: ArticleDraft[]) {
  return [...articles].sort((a, b) => {
    const partA = articlePartNumber(a);
    const partB = articlePartNumber(b);
    if (partA !== partB) return partA - partB;
    return (a.published_at ?? a.updated_at).localeCompare(b.published_at ?? b.updated_at);
  });
}

export async function getTopicDiscovery(slug: string) {
  const topic = getTopic(slug);
  if (!topic) return null;
  const articles = await listPublishedArticles();
  return {
    topic,
    series: SERIES.filter((series) => series.topicSlugs?.includes(slug)),
    questions: QUESTIONS.filter((question) => question.topicSlugs.includes(slug)),
    articles: articles.filter((article) => articleMatchesTopic(article, slug)),
  };
}

export async function getSeriesDiscovery(slug: string) {
  const series = getSeries(slug);
  if (!series) return null;
  const articles = await listPublishedArticles();
  return {
    series,
    topics: (series.topicSlugs ?? []).map(getTopic).filter((topic): topic is Topic => Boolean(topic)),
    questions: QUESTIONS.filter((question) => question.seriesSlug === slug),
    articles: orderSeriesArticles(articles.filter((article) => articleMatchesSeries(article, slug))),
  };
}

export async function getQuestionDiscovery(slug: string) {
  const question = QUESTIONS.find((item) => item.slug === slug) ?? null;
  if (!question) return null;
  const articles = await listPublishedArticles();
  return {
    question,
    topics: question.topicSlugs.map(getTopic).filter((topic): topic is Topic => Boolean(topic)),
    series: question.seriesSlug ? getSeries(question.seriesSlug) : null,
    articles: articles.filter((article) => articleMatchesQuestion(article, slug)),
  };
}
