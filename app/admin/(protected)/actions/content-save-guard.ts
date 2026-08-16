"use server";

import { sql } from "@vercel/postgres";
import { createDraftAction, updateDraftAction, type ContentDraftActionState } from "@/app/admin/(protected)/actions/content";
import { getDraftByTypeAndSlug, isValidDraftSlug, normalizeDraftSlug, type DraftContentType } from "@/app/lib/content-drafts";
import { normalizeRichTextDocument, richTextToLegacySections, type RichTextDocument } from "@/app/content/article-rich-text";
import { findUnsupportedText } from "@/app/lib/content-save-validation";

const contentTypes: DraftContentType[] = ["reflection", "journal", "book"];

type ParsedGuardInput = {
  contentType: DraftContentType;
  title: string;
  slug: string;
  draftId: string;
  date: string;
  readingTime: string;
  scripture: string;
  introduction: string;
  category: string;
  label: string;
  subtitle: string;
  expectedPublication: string;
  author: string;
  publisher: string;
  length: string;
  imageReference: string;
  tableOfContents: string[];
  tags: string[];
  featured: boolean;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  richText?: RichTextDocument;
};

function typeLabel(type: DraftContentType) {
  return type[0].toUpperCase() + type.slice(1);
}

function parseFormData(formData: FormData): ParsedGuardInput | { error: string } {
  const contentType = String(formData.get("contentType") ?? "").trim() as DraftContentType;
  const title = String(formData.get("title") ?? "").trim();
  const slug = normalizeDraftSlug(String(formData.get("slug") ?? ""));
  const draftId = String(formData.get("draftId") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const readingTime = String(formData.get("readingTime") ?? "").trim();
  const scripture = String(formData.get("scripture") ?? "").trim();
  const introduction = String(formData.get("introduction") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const expectedPublication = String(formData.get("expectedPublication") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const publisher = String(formData.get("publisher") ?? "").trim();
  const length = String(formData.get("length") ?? "").trim();
  const imageReference = String(formData.get("imageReference") ?? "").trim();
  const tableOfContents = String(formData.get("tableOfContents") ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
  const tags = String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);
  const featured = String(formData.get("featured") ?? "") === "yes";
  const rawSections = String(formData.get("sections") ?? "[]");
  const rawRichText = String(formData.get("richText") ?? "").trim();

  let sections: Array<{ heading: string; paragraphs: string[] }> = [];
  try {
    const parsed = JSON.parse(rawSections);
    if (!Array.isArray(parsed)) return { error: "The content sections must be a list." };
    sections = parsed
      .filter((section): section is { heading?: unknown; paragraphs?: unknown } => typeof section === "object" && section !== null)
      .map((section) => ({
        heading: typeof section.heading === "string" ? section.heading.trim() : "",
        paragraphs: Array.isArray(section.paragraphs)
          ? section.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph) => paragraph.trim()).filter(Boolean)
          : [],
      }))
      .filter((section) => section.heading || section.paragraphs.length);
  } catch {
    return { error: "The content sections could not be read because their formatting data is invalid." };
  }

  let richText: RichTextDocument | undefined;
  if (rawRichText) {
    try {
      richText = normalizeRichTextDocument(JSON.parse(rawRichText)) ?? undefined;
    } catch {
      return { error: "The article body could not be read because its formatting data is invalid." };
    }
    if (!richText) return { error: "The article body contains unsupported formatting data." };
    sections = richTextToLegacySections(richText);
  }

  return {
    contentType,
    title,
    slug,
    draftId,
    date,
    readingTime,
    scripture,
    introduction,
    category,
    label,
    subtitle,
    expectedPublication,
    author,
    publisher,
    length,
    imageReference,
    tableOfContents,
    tags,
    featured,
    sections,
    richText,
  };
}

function bodyFromParsed(input: ParsedGuardInput) {
  return {
    date: input.date,
    readingTime: input.readingTime,
    scripture: input.scripture,
    featured: input.featured,
    sections: input.sections,
    ...(input.richText ? { richText: input.richText } : {}),
    label: input.label,
    subtitle: input.subtitle,
    expectedPublication: input.expectedPublication,
    author: input.author,
    publisher: input.publisher,
    length: input.length,
    tableOfContents: input.tableOfContents,
  };
}

async function validateDraftBeforeSave(formData: FormData, mode: "create" | "update") {
  const input = parseFormData(formData);
  if ("error" in input) return input;

  if (!contentTypes.includes(input.contentType)) return { error: "Choose a valid content type." };
  if (!input.title) return { error: "A title is required." };
  if (!isValidDraftSlug(input.slug)) return { error: "Use a lowercase slug with letters, numbers, and single hyphens only." };

  const textPayload = {
    title: input.title,
    slug: input.slug,
    date: input.date,
    readingTime: input.readingTime,
    scripture: input.scripture,
    introduction: input.introduction,
    category: input.category,
    tags: input.tags,
    label: input.label,
    subtitle: input.subtitle,
    expectedPublication: input.expectedPublication,
    author: input.author,
    publisher: input.publisher,
    length: input.length,
    tableOfContents: input.tableOfContents,
    imageReference: input.imageReference,
    body: bodyFromParsed(input),
  };

  const unsupported = findUnsupportedText(textPayload, "content");
  if (unsupported) {
    const friendlyField = unsupported.field.replace(/^content\./, "");
    return { error: `The ${friendlyField} contains an unsupported character (${unsupported.codePoint}). The text was not changed.` };
  }

  const existing = await getDraftByTypeAndSlug(input.contentType, input.slug);
  if (existing && (mode === "create" || existing.id !== input.draftId)) {
    return { error: `This slug is already being used by another ${typeLabel(input.contentType)}.` };
  }

  const bodyJson = JSON.stringify(bodyFromParsed(input));
  const tagsJson = JSON.stringify(input.tags);

  try {
    await sql`SELECT ${bodyJson}::jsonb`;
  } catch (error) {
    console.error("[content-drafts] Body JSONB preflight failed.", error);
    return { error: "The article body could not be saved because its structured data is not valid for the database." };
  }

  try {
    await sql`SELECT ${tagsJson}::jsonb`;
  } catch (error) {
    console.error("[content-drafts] Tags JSONB preflight failed.", error);
    return { error: "The tags could not be saved because their structured data is not valid for the database." };
  }

  return { ok: true as const };
}

export async function createDraftActionSafe(previousState: ContentDraftActionState, formData: FormData) {
  const validation = await validateDraftBeforeSave(formData, "create");
  if ("error" in validation) return { status: "error" as const, message: validation.error };
  return createDraftAction(previousState, formData);
}

export async function updateDraftActionSafe(previousState: ContentDraftActionState, formData: FormData) {
  const validation = await validateDraftBeforeSave(formData, "update");
  if ("error" in validation) return { status: "error" as const, message: validation.error };
  return updateDraftAction(previousState, formData);
}
