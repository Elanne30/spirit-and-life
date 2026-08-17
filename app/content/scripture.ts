import type { ContentRelations } from "@/app/content/types";

export type ScriptureReference = ContentRelations & {
  slug: string;
  reference: string;
  book: string;
  chapter: number;
  passage: string;
  summary: string;
};

export const scriptureReferences: ScriptureReference[] = [
  {
    slug: "nehemiah-8-8",
    reference: "Nehemiah 8:8",
    book: "Nehemiah",
    chapter: 8,
    passage: "Nehemiah 8:8",
    summary: "A reference connected to careful reading and faithful understanding of Scripture.",
    relatedReflectionSlugs: ["reading-scripture-in-context-why-it-matters"],
    relatedJournalSlugs: ["on-slowing-down-to-read"],
  },
  {
    slug: "romans-8-28",
    reference: "Romans 8:28",
    book: "Romans",
    chapter: 8,
    passage: "Romans 8:28",
    summary: "A reference connected to grace, suffering, and God's redemptive purpose.",
    relatedReflectionSlugs: ["the-grace-that-transforms-a-reflection-on-romans-8"],
    relatedJournalSlugs: ["notes-from-morning-prayer"],
    relatedStudyPlanDates: ["2026-11-21", "2026-11-22"],
  },
  {
    slug: "mark-9-24",
    reference: "Mark 9:24",
    book: "Mark",
    chapter: 9,
    passage: "Mark 9:24",
    summary: "A reference connected to honest questions, belief, and faithful dependence.",
    relatedReflectionSlugs: ["honest-questions-and-faithful-faith"],
  },
];

export function getScriptureReference(slug: string) {
  return scriptureReferences.find((reference) => reference.slug === slug);
}
