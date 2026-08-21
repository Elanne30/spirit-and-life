export const contentCategories = [
  "Biblical Studies",
  "Theology",
  "Christian Living",
  "Faith & Life",
  "Philosophy",
  "Apologetics",
  "Church History",
] as const;

export type ContentCategory = (typeof contentCategories)[number];
export type ReflectionCategory = ContentCategory | "SCRIPTURE";

export type ContentRelations = {
  relatedArticleSlugs?: string[];
  relatedReflectionSlugs?: string[];
  relatedJournalSlugs?: string[];
  relatedBookSlugs?: string[];
  relatedStudyPlanDates?: string[];
  relatedQuestionSlugs?: string[];
  relatedPodcastSlugs?: string[];
  relatedResourceSlugs?: string[];
};

export type StudyPlanRelationships = Record<string, ContentRelations>;
