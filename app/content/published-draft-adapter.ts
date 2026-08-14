import type { ContentRelations } from "@/app/content/types";
import type { Reflection } from "@/app/data/reflections";
import type { Journal } from "@/app/data/journals";
import type { Book } from "@/app/data/books";
import type { ContentDraft } from "@/app/lib/content-drafts";

type ReflectionBody = {
  date?: unknown;
  readingTime?: unknown;
  scripture?: unknown;
  featured?: unknown;
  sections?: unknown;
  relatedReflectionSlugs?: unknown;
  relatedJournalSlugs?: unknown;
  relatedBookSlugs?: unknown;
  relatedStudyPlanDates?: unknown;
};

type JournalBody = {
  date?: unknown;
  label?: unknown;
  featured?: unknown;
  sections?: unknown;
  relatedReflectionSlugs?: unknown;
  relatedJournalSlugs?: unknown;
  relatedBookSlugs?: unknown;
  relatedStudyPlanDates?: unknown;
};

type BookBody = {
  subtitle?: unknown;
  expectedPublication?: unknown;
  author?: unknown;
  publisher?: unknown;
  length?: unknown;
  tableOfContents?: unknown;
  featured?: unknown;
  relatedReflectionSlugs?: unknown;
  relatedJournalSlugs?: unknown;
  relatedBookSlugs?: unknown;
  relatedStudyPlanDates?: unknown;
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function asReflectionCategory(value: string | null) {
  const categories = [
    "Biblical Studies",
    "Theology",
    "Christian Living",
    "Faith & Life",
    "Philosophy",
    "Apologetics",
    "Church History",
    "SCRIPTURE",
  ] as const;

  return categories.includes(value as (typeof categories)[number])
    ? (value as Reflection["category"])
    : "Biblical Studies";
}

function asContentCategory(value: string | null) {
  const categories = [
    "Biblical Studies",
    "Theology",
    "Christian Living",
    "Faith & Life",
    "Philosophy",
    "Apologetics",
    "Church History",
  ] as const;

  return categories.includes(value as (typeof categories)[number])
    ? (value as Journal["category"])
    : undefined;
}

function parseSections(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (section): section is { heading?: unknown; paragraphs?: unknown } =>
        typeof section === "object" && section !== null,
    )
    .map((section) => ({
      heading: asString(section.heading),
      paragraphs: asStringArray(section.paragraphs),
    }))
    .filter((section) => section.heading || section.paragraphs.length > 0);
}

function draftToReflection(draft: ContentDraft): Reflection | null {
  if (draft.content_type !== "reflection") {
    return null;
  }

  const body = draft.body as ReflectionBody;

  const date = asString(body.date);
  const readingTime = asString(body.readingTime);
  const scripture = asString(body.scripture);
  const sections = parseSections(body.sections);

  const relations: ContentRelations = {
    relatedReflectionSlugs: asStringArray(body.relatedReflectionSlugs),
    relatedJournalSlugs: asStringArray(body.relatedJournalSlugs),
    relatedBookSlugs: asStringArray(body.relatedBookSlugs),
    relatedStudyPlanDates: asStringArray(body.relatedStudyPlanDates),
  };

  return {
    type: "reflection",
    contentSlug: draft.slug,
    title: draft.title,
    image: draft.image_reference || "/images/placeholder-content.jpg",
    date,
    readingTime,
    category: asReflectionCategory(draft.category),
    tags: draft.tags,
    scripture,
    introduction: draft.introduction ?? "",
    sections,
    featured: body.featured === true,
    ...relations,
  };
}

export function publishedDraftToReflection(draft: ContentDraft): Reflection | null {
  return draft.status === "published" ? draftToReflection(draft) : null;
}

export function draftToReflectionPreview(draft: ContentDraft): Reflection | null {
  return draftToReflection(draft);
}

function draftToJournal(draft: ContentDraft): Journal | null {
  if (draft.content_type !== "journal") {
    return null;
  }

  const body = draft.body as JournalBody;

  const relations: ContentRelations = {
    relatedReflectionSlugs: asStringArray(body.relatedReflectionSlugs),
    relatedJournalSlugs: asStringArray(body.relatedJournalSlugs),
    relatedBookSlugs: asStringArray(body.relatedBookSlugs),
    relatedStudyPlanDates: asStringArray(body.relatedStudyPlanDates),
  };

  return {
    type: "journal",
    contentSlug: draft.slug,
    title: draft.title,
    image: draft.image_reference || "/images/placeholder-content.jpg",
    date: asString(body.date),
    label: asString(body.label, "JOURNAL ENTRY"),
    category: asContentCategory(draft.category),
    featured: body.featured === true,
    introduction: draft.introduction ?? "",
    sections: parseSections(body.sections),
    ...relations,
  };
}

export function publishedDraftToJournal(draft: ContentDraft): Journal | null {
  return draft.status === "published" ? draftToJournal(draft) : null;
}

export function draftToJournalPreview(draft: ContentDraft): Journal | null {
  return draftToJournal(draft);
}

function draftToBook(draft: ContentDraft): Book | null {
  if (draft.content_type !== "book") {
    return null;
  }

  const body = draft.body as BookBody;

  const relations: ContentRelations = {
    relatedReflectionSlugs: asStringArray(body.relatedReflectionSlugs),
    relatedJournalSlugs: asStringArray(body.relatedJournalSlugs),
    relatedBookSlugs: asStringArray(body.relatedBookSlugs),
    relatedStudyPlanDates: asStringArray(body.relatedStudyPlanDates),
  };

  return {
    type: "book",
    contentSlug: draft.slug,
    title: draft.title,
    cover: draft.image_reference || undefined,
    status: "Coming Soon",
    category: asContentCategory(draft.category),
    featured: body.featured === true,
    subtitle: asString(body.subtitle) || undefined,
    expectedPublication: asString(body.expectedPublication) || undefined,
    author: asString(body.author) || undefined,
    description: draft.introduction ?? undefined,
    publisher: asString(body.publisher) || undefined,
    length: asString(body.length) || undefined,
    tableOfContents: asStringArray(body.tableOfContents).length ? asStringArray(body.tableOfContents) : undefined,
    ...relations,
  };
}

export function publishedDraftToBook(draft: ContentDraft): Book | null {
  return draft.status === "published" ? draftToBook(draft) : null;
}

export function draftToBookPreview(draft: ContentDraft): Book | null {
  return draftToBook(draft);
}
