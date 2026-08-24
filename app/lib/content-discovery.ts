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
    articles: articles.filter((article) => articleMatchesSeries(article, slug)),
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
