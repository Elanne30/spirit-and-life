"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";
import { updateDraftAction, type ContentDraftActionState } from "@/app/admin/(protected)/actions/content";
import { createDraft, getDraftByTypeAndSlug, isValidDraftSlug, normalizeDraftSlug, type DraftContentType } from "@/app/lib/content-drafts";
import { legacySectionsToRichText, normalizeRichTextDocument, richTextToLegacySections, type RichTextDocument } from "@/app/content/article-rich-text";
import { findUnsupportedText, getPostgresErrorDetails } from "@/app/lib/content-save-validation";
import { requireAdminActionAccess } from "@/app/lib/admin-session";

const contentTypes: DraftContentType[] = ["reflection", "journal", "book"];
const allowedBookCoverTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBookCoverSize = 8 * 1024 * 1024;

type ParsedGuardInput = {
  contentType: DraftContentType; title: string; slug: string; draftId: string; date: string; readingTime: string;
  scripture: string; introduction: string; category: string; label: string; subtitle: string; expectedPublication: string;
  author: string; publisher: string; length: string; imageReference: string; tableOfContents: string[]; tags: string[];
  featured: boolean; sections: Array<{ heading: string; paragraphs: string[] }>; richText?: RichTextDocument;
};

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
    sections = parsed.filter((section): section is { heading?: unknown; paragraphs?: unknown } => typeof section === "object" && section !== null).map((section) => ({
      heading: typeof section.heading === "string" ? section.heading.trim() : "",
      paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph) => paragraph.trim()).filter(Boolean) : [],
    })).filter((section) => section.heading || section.paragraphs.length);
  } catch {
    return { error: "The content sections could not be read because their formatting data is invalid." };
  }

  let richText: RichTextDocument | undefined;
  if (rawRichText) {
    try {
      const parsedRichText = JSON.parse(rawRichText);
      // The editor can contain formatting extensions that the legacy normalizer
      // does not understand yet. Never block a save because of those extensions.
      // Fall back to the plain-text projection already submitted by the editor.
      richText = normalizeRichTextDocument(parsedRichText) ?? legacySectionsToRichText(sections);
    } catch {
      // If the rich-text payload itself is malformed, the submitted legacy
      // sections are still valid content and should remain saveable.
      richText = legacySectionsToRichText(sections);
    }
    sections = richTextToLegacySections(richText);
  }

  return { contentType, title, slug, draftId, date, readingTime, scripture, introduction, category, label, subtitle, expectedPublication, author, publisher, length, imageReference, tableOfContents, tags, featured, sections, richText };
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

  if (mode === "create") {
    const existing = await getDraftByTypeAndSlug(input.contentType, input.slug);
    if (existing) return { error: `This slug is already being used by another ${input.contentType}. Choose a different slug.` };
  }

  const textPayload = {
    title: input.title, slug: input.slug, date: input.date, readingTime: input.readingTime, scripture: input.scripture,
    introduction: input.introduction, category: input.category, tags: input.tags, label: input.label, subtitle: input.subtitle,
    expectedPublication: input.expectedPublication, author: input.author, publisher: input.publisher, length: input.length,
    tableOfContents: input.tableOfContents, imageReference: input.imageReference, body: bodyFromParsed(input),
  };
  const unsupported = findUnsupportedText(textPayload, "content");
  if (unsupported) {
    const friendlyField = unsupported.field.replace(/^content\./, "");
    return { error: `The ${friendlyField} contains an unsupported character (${unsupported.codePoint}). The text was not changed.` };
  }

  if (mode === "update") {
    const existing = await getDraftByTypeAndSlug(input.contentType, input.slug);
    if (existing && existing.id !== input.draftId) return { error: `This slug is already being used by another ${input.contentType}. Choose a different slug for this existing ${input.contentType}.` };
  }

  const cover = formData.get("bookCover");
  if (input.contentType === "book" && cover instanceof File && cover.size > 0) {
    if (!allowedBookCoverTypes.has(cover.type)) return { error: "Use a JPG, PNG, WebP, or GIF image for the book cover." };
    if (cover.size > maxBookCoverSize) return { error: "Book covers must be 8 MB or smaller." };
  }

  try { await sql`SELECT ${JSON.stringify(bodyFromParsed(input))}::jsonb`; }
  catch (error) { console.error("[content-drafts] Body JSONB preflight failed.", getPostgresErrorDetails(error)); return { error: "The article body could not be saved because its structured data is not valid for the database." }; }
  try { await sql`SELECT ${JSON.stringify(input.tags)}::jsonb`; }
  catch (error) { console.error("[content-drafts] Tags JSONB preflight failed.", getPostgresErrorDetails(error)); return { error: "The tags could not be saved because their structured data is not valid for the database." }; }
  return { ok: true as const };
}

export async function createDraftActionSafe(previousState: ContentDraftActionState, formData: FormData): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const input = parseFormData(formData);
  if ("error" in input) return { status: "error", message: input.error };
  const validation = await validateDraftBeforeSave(formData, "create");
  if ("error" in validation) return { status: "error", message: validation.error };
  const saveMode = String(formData.get("saveMode") ?? "draft").trim();
  let draft: Awaited<ReturnType<typeof createDraft>>;

  try {
    const cover = formData.get("bookCover");
    let imageReference = input.imageReference || undefined;
    if (input.contentType === "book" && cover instanceof File && cover.size > 0) {
      const extension = cover.name.split(".").pop()?.toLowerCase() || "jpg";
      const blob = await put(`content/book/${input.slug}-${Date.now()}.${extension}`, cover, { access: "public", addRandomSuffix: true, contentType: cover.type });
      imageReference = blob.url;
    }

    draft = await createDraft({
      contentType: input.contentType,
      title: input.title,
      slug: input.slug,
      introduction: input.introduction || undefined,
      category: input.category || undefined,
      tags: input.tags,
      imageReference,
      body: bodyFromParsed(input),
    });
  } catch (error) {
    const details = getPostgresErrorDetails(error);
    console.error("[content-drafts] Create draft failed.", details);
    if (details.code === "23505") return { status: "error", message: "This slug is already being used. Choose a different slug." };
    return { status: "error", message: "The draft could not be saved. Your writing was not changed." };
  }

  if (!draft) return { status: "error", message: "The draft could not be created." };
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${draft.content_type}`);
  revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`);
  if (saveMode === "continue") redirect(`/admin/content/${draft.content_type}/${draft.slug}?view=edit`);
  redirect(`/admin/content/${draft.content_type}`);
}

export async function updateDraftActionSafe(previousState: ContentDraftActionState, formData: FormData): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const validation = await validateDraftBeforeSave(formData, "update");
  if ("error" in validation) return { status: "error", message: validation.error };
  return updateDraftAction(previousState, formData);
}
