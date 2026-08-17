"use server";

import { redirect } from "next/navigation";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import {
  createDraft,
  deleteContent,
  getDraftByTypeAndSlug,
  isValidDraftSlug,
  normalizeDraftSlug,
  publishDraft,
  updateDraft,
  updateDraftImage,
  type DraftContentType,
} from "@/app/lib/content-drafts";
import { reflections } from "@/app/data/reflections";
import { journals } from "@/app/data/journals";
import { books } from "@/app/data/books";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { legacySectionsToRichText, normalizeRichTextDocument, richTextToLegacySections, type RichTextDocument } from "@/app/content/article-rich-text";

export type ContentDraftActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageSize = 8 * 1024 * 1024;

type ParsedDraftInput =
  | {
      draftId: string; contentType: DraftContentType; title: string; slug: string; date: string; readingTime: string; scripture: string;
      introduction: string; category: string; tags: string[]; featured: boolean; sections: Array<{ heading: string; paragraphs: string[] }>;
      richText: RichTextDocument | undefined; label: string; subtitle: string; expectedPublication: string; author: string; publisher: string;
      length: string; tableOfContents: string[]; imageReference: string;
    }
  | { error: string };

function readDraftInput(formData: FormData): ParsedDraftInput {
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
        paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph) => paragraph.trim()).filter(Boolean) : [],
      }))
      .filter((section) => section.heading || section.paragraphs.length);
  } catch {
    return { error: "The content sections could not be read." };
  }

  let richText: RichTextDocument | undefined;
  if (rawRichText) {
    try {
      const parsed = JSON.parse(rawRichText);
      richText = normalizeRichTextDocument(parsed) ?? undefined;
    } catch {
      richText = undefined;
    }
    // The plain section projection is the compatibility source of truth. A
    // formatting extension unknown to the server must never prevent saving.
    if (richText) sections = richTextToLegacySections(richText);
    else richText = legacySectionsToRichText(sections);
  }

  if (!( ["reflection", "journal", "book"] as DraftContentType[]).includes(contentType)) return { error: "Choose a valid content type." };
  if (!title) return { error: "A title is required." };
  if (!isValidDraftSlug(slug)) return { error: "Use a lowercase slug with letters, numbers, and single hyphens only." };

  return { draftId, contentType, title, slug, date, readingTime, scripture, introduction, category, tags, featured, sections, richText, label, subtitle, expectedPublication, author, publisher, length, tableOfContents, imageReference };
}

function bodyFromInput(input: Exclude<ParsedDraftInput, { error: string }>) {
  return {
    date: input.date, readingTime: input.readingTime, scripture: input.scripture, featured: input.featured,
    sections: input.sections, ...(input.richText ? { richText: input.richText } : {}), label: input.label, subtitle: input.subtitle,
    expectedPublication: input.expectedPublication, author: input.author, publisher: input.publisher, length: input.length, tableOfContents: input.tableOfContents,
  };
}

export async function uploadContentImageAction(_previousState: ContentDraftActionState, formData: FormData): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const draftId = String(formData.get("draftId") ?? "").trim(); const file = formData.get("image");
  if (!draftId || !(file instanceof File) || file.size === 0) return { status: "error", message: "Choose an image before uploading." };
  if (!allowedImageTypes.has(file.type)) return { status: "error", message: "Use a JPG, PNG, WebP, or GIF image." };
  if (file.size > maxImageSize) return { status: "error", message: "Images must be 8 MB or smaller." };
  try {
    const draft = await import("@/app/lib/content-drafts").then(({ getDraft }) => getDraft(draftId));
    if (!draft) return { status: "error", message: "Draft not found." };
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const blob = await put(`content/${draft.content_type}/${draft.slug}-${Date.now()}.${extension}`, file, { access: "public", addRandomSuffix: true, contentType: file.type });
    const updated = await updateDraftImage(draftId, blob.url);
    if (!updated) return { status: "error", message: "Draft not found." };
    revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`);
    revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}/edit`);
    revalidatePath(`/${draft.content_type === "reflection" ? "reflections" : draft.content_type === "journal" ? "journals" : "books"}/${draft.slug}`);
    return { status: "success", message: "Image uploaded and saved." };
  } catch (error) {
    console.error("[content-images] Upload failed.", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: "The image could not be uploaded. Your existing image is unchanged." };
  }
}

export async function createDraftAction(_previousState: ContentDraftActionState, formData: FormData): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const input = readDraftInput(formData); if ("error" in input) return { status: "error", message: input.error };
  const saveMode = String(formData.get("saveMode") ?? "draft").trim();
  try {
    const draft = await createDraft({ contentType: input.contentType, title: input.title, slug: input.slug, introduction: input.introduction || undefined, category: input.category || undefined, tags: input.tags, imageReference: input.imageReference || undefined, body: bodyFromInput(input) });
    if (!draft) return { status: "error", message: "The draft could not be created." };
    revalidatePath("/admin/content"); revalidatePath(`/admin/content/${draft.content_type}`); revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`); revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}/edit`);
    if (saveMode === "continue") redirect(`/admin/content/${draft.content_type}/${draft.slug}?view=edit`);
    redirect(`/admin/content/${draft.content_type}`);
  } catch (error) {
    console.error("[content-drafts] Create draft failed.", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: "That draft slug is already in use or could not be saved." };
  }
}

export async function updateDraftAction(_previousState: ContentDraftActionState, formData: FormData): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const input = readDraftInput(formData); if ("error" in input) return { status: "error", message: input.error };
  if (!input.draftId) return { status: "error", message: "A draft id is required for updates." };
  try {
    const draft = await updateDraft(input.draftId, { contentType: input.contentType, title: input.title, slug: input.slug, introduction: input.introduction || undefined, category: input.category || undefined, tags: input.tags, imageReference: input.imageReference || undefined, body: bodyFromInput(input) });
    if (!draft) return { status: "error", message: "Draft not found." };
    revalidatePath("/admin/content"); revalidatePath(`/admin/content/${draft.content_type}`); revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`); revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}/edit`);
    return { status: "success", message: "Draft updated." };
  } catch (error) {
    console.error("[content-drafts] Update draft failed.", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: "That draft slug is already in use or could not be updated." };
  }
}

function publicListRoute(contentType: DraftContentType) { return contentType === "reflection" ? "reflections" : contentType === "journal" ? "journals" : "books"; }
function revalidatePublicRoutes(contentType: DraftContentType, slug: string) { const listRoute = publicListRoute(contentType); revalidatePath(`/${listRoute}`); revalidatePath(`/${listRoute}/${slug}`); revalidatePath("/"); revalidatePath("/search"); revalidatePath("/sitemap.xml"); }

export async function publishDraftAction(_previousState: ContentDraftActionState, formData: FormData): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const draftId = String(formData.get("draftId") ?? "").trim(); if (!draftId) return { status: "error", message: "A draft id is required to publish." };
  try {
    const draft = await publishDraft(draftId); if (!draft) return { status: "error", message: "Draft not found." };
    revalidatePath("/admin/content"); revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`); revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}/edit`); revalidatePublicRoutes(draft.content_type, draft.slug);
    return { status: "success", message: "Published. It is now live on the public website." };
  } catch (error) {
    console.error("[content-drafts] Publish draft failed.", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: "That content could not be published." };
  }
}

export async function deleteContentAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;
  const contentType = String(formData.get("contentType") ?? "").trim() as DraftContentType; const slug = normalizeDraftSlug(String(formData.get("slug") ?? ""));
  if (!( ["reflection", "journal", "book"] as DraftContentType[]).includes(contentType) || !slug) return;
  await deleteContent(contentType, slug); revalidatePath("/admin"); revalidatePath("/admin/content"); revalidatePublicRoutes(contentType, slug); redirect("/admin/content");
}

function findStaticSeed(contentType: DraftContentType, slug: string) { if (contentType === "reflection") return reflections.find((item) => item.contentSlug === slug); if (contentType === "journal") return journals.find((item) => item.contentSlug === slug); return books.find((item) => item.contentSlug === slug); }

export async function startEditingContentAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;
  const contentType = String(formData.get("contentType") ?? "").trim() as DraftContentType; const slug = normalizeDraftSlug(String(formData.get("slug") ?? ""));
  if (!( ["reflection", "journal", "book"] as DraftContentType[]).includes(contentType) || !slug) return;
  const existingDraft = await getDraftByTypeAndSlug(contentType, slug);
  if (!existingDraft) {
    const seed = findStaticSeed(contentType, slug);
    if (seed) { const seedRecord = seed as Record<string, unknown>; await createDraft({ contentType, title: String(seedRecord.title ?? ""), slug, introduction: typeof seedRecord.introduction === "string" ? seedRecord.introduction : (typeof seedRecord.description === "string" ? seedRecord.description : undefined), category: typeof seedRecord.category === "string" ? seedRecord.category : undefined, tags: Array.isArray(seedRecord.tags) ? (seedRecord.tags as string[]) : [], imageReference: typeof seedRecord.image === "string" ? seedRecord.image : (typeof seedRecord.cover === "string" ? seedRecord.cover : undefined), body: typeof seedRecord.body === "object" && seedRecord.body !== null ? (seedRecord.body as Record<string, unknown>) : {} }); }
  }
  revalidatePath("/admin/content"); revalidatePath(`/admin/content/${contentType}`); redirect(`/admin/content/${contentType}/${slug}?view=edit`);
}
