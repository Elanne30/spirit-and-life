import { getSeries, getTopic, TOPICS, SERIES, type Series, type Topic } from "@/app/lib/content-taxonomy";
import { QUESTIONS, type Question } from "@/app/lib/questions";

export type DiscoveryTaxonomy = {
  topics: readonly Topic[];
  series: readonly Series[];
  questions: readonly Question[];
};

export function getDiscoveryTaxonomy(): DiscoveryTaxonomy {
  return { topics: TOPICS, series: SERIES, questions: QUESTIONS };
}

export function getTopicDiscovery(slug: string) {
  const topic = getTopic(slug);
  if (!topic) return null;
  return {
    topic,
    series: SERIES.filter((series) => series.topicSlugs?.includes(slug)),
    questions: QUESTIONS.filter((question) => question.topicSlugs.includes(slug)),
  };
}

export function getSeriesDiscovery(slug: string) {
  const series = getSeries(slug);
  if (!series) return null;
  return {
    series,
    topics: (series.topicSlugs ?? []).map(getTopic).filter((topic): topic is Topic => Boolean(topic)),
    questions: QUESTIONS.filter((question) => question.seriesSlug === slug),
  };
}

export function getQuestionDiscovery(slug: string) {
  const question = QUESTIONS.find((item) => item.slug === slug) ?? null;
  if (!question) return null;
  return {
    question,
    topics: question.topicSlugs.map(getTopic).filter((topic): topic is Topic => Boolean(topic)),
    series: question.seriesSlug ? getSeries(question.seriesSlug) : null,
  };
}
