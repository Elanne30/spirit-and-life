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
  relatedReflectionSlugs?: string[];
  relatedJournalSlugs?: string[];
  relatedBookSlugs?: string[];
  relatedStudyPlanDates?: string[];
};

export type StudyPlanRelationships = Record<string, ContentRelations>;
