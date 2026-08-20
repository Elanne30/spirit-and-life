export type Question = {
  slug: string;
  question: string;
  description?: string;
  topicSlugs: readonly string[];
  seriesSlug?: string;
  relatedContent?: readonly string[];
};

/**
 * Question-first discovery layer for difficult Christian questions.
 * Questions remain editorial data for now and can be moved to managed content
 * without changing the public shape later.
 */
export const QUESTIONS: readonly Question[] = [
  {
    slug: "why-would-a-good-god-allow-suffering",
    question: "Why would a good God allow suffering?",
    description: "A starting point for examining the problem of suffering and evil from a Christian perspective.",
    topicSlugs: ["god", "suffering-and-evil", "apologetics"],
    seriesSlug: "the-problem-of-evil",
  },
];

export function getQuestion(slug: string) {
  return QUESTIONS.find((question) => question.slug === slug) ?? null;
}
