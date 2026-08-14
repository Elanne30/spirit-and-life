import type { ContentRelations } from "@/app/content/types";
import type { Reflection } from "@/app/data/reflections";
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

export function publishedDraftToReflection(
  draft: ContentDraft,
): Reflection | null {
  if (draft.content_type !== "reflection" || draft.status !== "published") {
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
