import { studies } from "@/app/data/study-plan";
import { scriptureReferences } from "@/app/content/scripture";
import { listPublishedBooks, listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { listDeletedContentSlugs } from "@/app/lib/content-drafts";
import type { ContentRelations } from "@/app/content/types";

let hasValidatedPublishingData = false;

function addDuplicateErrors(values: string[], label: string, errors: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }

    seen.add(value);
  }

  for (const duplicate of duplicates) {
    errors.push(`${label} has duplicate value "${duplicate}".`);
  }
}

function isBlank(value: string | undefined) {
  return !value || value.trim().length === 0;
}

function addRelationshipErrors(
  label: string,
  slug: string,
  relations: ContentRelations,
  reflectionSlugs: Set<string>,
  journalSlugs: Set<string>,
  bookSlugs: Set<string>,
  deletedBookSlugs: Set<string>,
  studyDates: Set<string>,
  errors: string[],
) {
  const relationChecks: Array<{ key: keyof ContentRelations; values?: string[]; valid: Set<string> }> = [
    { key: "relatedReflectionSlugs", values: relations.relatedReflectionSlugs, valid: reflectionSlugs },
    { key: "relatedJournalSlugs", values: relations.relatedJournalSlugs, valid: journalSlugs },
    { key: "relatedBookSlugs", values: relations.relatedBookSlugs, valid: bookSlugs },
    { key: "relatedStudyPlanDates", values: relations.relatedStudyPlanDates, valid: studyDates },
  ];

  for (const { key, values, valid } of relationChecks) {
    if (!values) {
      continue;
    }

    addDuplicateErrors(values, `${label} "${slug}" ${key}`, errors);

    for (const value of values) {
      // A relation to a book that has explicitly been deleted is stale data,
      // but it must not make the entire public build fail. The deleted book
      // is already excluded from the published repository.
      if (key === "relatedBookSlugs" && deletedBookSlugs.has(value)) {
        continue;
      }

      if (!valid.has(value)) {
        errors.push(`${label} "${slug}" references missing ${key} value "${value}".`);
      }
    }
  }
}

export async function ensurePublishingIntegrity() {
  if (hasValidatedPublishingData || typeof window !== "undefined") {
    return;
  }

  hasValidatedPublishingData = true;

  const errors: string[] = [];
  const studyDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  const scriptureReferencePattern = /^(?:[1-3]\s)?[A-Za-z]+(?:\s[A-Za-z]+)*\s\d+:\d+(?:-\d+)?$/;

  const [reflections, journals, books, deletedBookSlugs] = await Promise.all([
    listPublishedReflections(),
    listPublishedJournals(),
    listPublishedBooks(),
    listDeletedContentSlugs("book"),
  ]);
  const reflectionSlugs = reflections.map((item) => item.contentSlug);
  const journalSlugs = journals.map((item) => item.contentSlug);
  const bookSlugs = books.map((item) => item.contentSlug);
  const scriptureSlugs = scriptureReferences.map((item) => item.slug);
  const studyDates = studies.map((item) => item.date);

  addDuplicateErrors(reflectionSlugs, "Reflection slugs", errors);
  addDuplicateErrors(journalSlugs, "Journal slugs", errors);
  addDuplicateErrors(bookSlugs, "Book slugs", errors);
  addDuplicateErrors(scriptureSlugs, "Scripture slugs", errors);
  addDuplicateErrors(studyDates, "Study dates", errors);

  const reflectionSlugSet = new Set(reflectionSlugs);
  const journalSlugSet = new Set(journalSlugs);
  const bookSlugSet = new Set(bookSlugs);
  const studyDateSet = new Set(studyDates);

  for (const reflection of reflections) {
    if (isBlank(reflection.title)) errors.push(`Reflection "${reflection.contentSlug}" is missing a title.`);
    if (isBlank(reflection.date)) errors.push(`Reflection "${reflection.contentSlug}" is missing a date.`);
    if (isBlank(reflection.readingTime)) errors.push(`Reflection "${reflection.contentSlug}" is missing readingTime.`);
    if (isBlank(reflection.introduction)) errors.push(`Reflection "${reflection.contentSlug}" is missing an introduction.`);
    if (isBlank(reflection.scripture)) errors.push(`Reflection "${reflection.contentSlug}" is missing scripture.`);
    if (!reflection.sections.length) errors.push(`Reflection "${reflection.contentSlug}" has no sections.`);
    if (isBlank(reflection.image)) errors.push(`Reflection "${reflection.contentSlug}" is missing image.`);

    addRelationshipErrors("Reflection", reflection.contentSlug, reflection, reflectionSlugSet, journalSlugSet, bookSlugSet, deletedBookSlugs, studyDateSet, errors);
  }

  for (const journal of journals) {
    if (isBlank(journal.title)) errors.push(`Journal "${journal.contentSlug}" is missing a title.`);
    if (isBlank(journal.date)) errors.push(`Journal "${journal.contentSlug}" is missing a date.`);
    if (isBlank(journal.label)) errors.push(`Journal "${journal.contentSlug}" is missing a label.`);
    if (isBlank(journal.introduction)) errors.push(`Journal "${journal.contentSlug}" is missing an introduction.`);
    if (!journal.sections.length) errors.push(`Journal "${journal.contentSlug}" has no sections.`);
    if (isBlank(journal.image)) errors.push(`Journal "${journal.contentSlug}" is missing image.`);

    addRelationshipErrors("Journal", journal.contentSlug, journal, reflectionSlugSet, journalSlugSet, bookSlugSet, deletedBookSlugs, studyDateSet, errors);
  }

  for (const book of books) {
    if (isBlank(book.title)) errors.push(`Book "${book.contentSlug}" is missing a title.`);
    if (isBlank(book.status)) errors.push(`Book "${book.contentSlug}" is missing status.`);

    addRelationshipErrors("Book", book.contentSlug, book, reflectionSlugSet, journalSlugSet, bookSlugSet, deletedBookSlugs, studyDateSet, errors);
  }

  for (const scripture of scriptureReferences) {
    if (isBlank(scripture.reference)) errors.push(`Scripture "${scripture.slug}" is missing reference.`);
    if (!scriptureReferencePattern.test(scripture.reference)) {
      errors.push(`Scripture "${scripture.slug}" has malformed reference "${scripture.reference}".`);
    }
    if (isBlank(scripture.summary)) errors.push(`Scripture "${scripture.slug}" is missing summary.`);

    addRelationshipErrors("Scripture", scripture.slug, scripture, reflectionSlugSet, journalSlugSet, bookSlugSet, deletedBookSlugs, studyDateSet, errors);
  }

  for (const study of studies) {
    if (!studyDatePattern.test(study.date)) {
      errors.push(`Study entry has malformed date "${study.date}".`);
    }
    if (isBlank(study.weekday)) errors.push(`Study "${study.date}" is missing weekday.`);
    if (isBlank(study.passage)) errors.push(`Study "${study.date}" is missing passage.`);
    if (isBlank(study.focus)) errors.push(`Study "${study.date}" is missing focus.`);
  }

  if (errors.length) {
    throw new Error(`Publishing data validation failed:\n- ${errors.join("\n- ")}`);
  }
}
