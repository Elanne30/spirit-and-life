"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { createArticleDraft, getArticleDraftBySlug, isValidDraftSlug, normalizeDraftSlug, publishArticleDraft, unpublishArticleDraft, updateArticleDraft } from "@/app/lib/content-drafts";

export type ArticleActionState = { status: "idle" | "success" | "error"; message: string };

function parseJson(value: FormDataEntryValue | null) { try { const parsed = JSON.parse(String(value ?? "")); return parsed && typeof parsed === "object" ? parsed : undefined; } catch { return undefined; } }
function parseSections(formData: FormData) {
  const parsed = parseJson(formData.get("sections"));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((section): section is { heading?: unknown; paragraphs?: unknown } => typeof section === "object" && section !== null).map((section) => ({ heading: typeof section.heading === "string" ? section.heading.trim() : "", paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean) : [] })).filter((section) => section.heading || section.paragraphs.length);
}
function read(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim(), slug = normalizeDraftSlug(String(formData.get("slug") ?? "")), category = String(formData.get("category") ?? "").trim(), date = String(formData.get("date") ?? "").trim(), readingTime = String(formData.get("readingTime") ?? "").trim(), introduction = String(formData.get("introduction") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").split(",").map((value) => value.trim()).filter(Boolean), featured = String(formData.get("featured") ?? "") === "yes", sections = parseSections(formData), richText = parseJson(formData.get("richText"));
  return { title, slug, category, date, readingTime, introduction, tags, featured, sections, richText };
}
function bodyOf(input: ReturnType<typeof read>) { return { date: input.date, readingTime: input.readingTime, featured: input.featured, sections: input.sections, ...(input.richText ? { richText: input.richText } : {}) }; }

export async function createArticleAction(_previous: ArticleActionState, formData: FormData): Promise<ArticleActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const input = read(formData);
  if (!input.title) return { status: "error", message: "A title is required." };
  if (!isValidDraftSlug(input.slug)) return { status: "error", message: "Use a lowercase slug with letters, numbers, and single hyphens only." };
  if (await getArticleDraftBySlug(input.slug)) return { status: "error", message: "This article slug is already in use. Choose a different slug." };

  let draft;
  try {
    draft = await createArticleDraft({ contentType: "article", title: input.title, slug: input.slug, category: input.category || undefined, introduction: input.introduction || undefined, tags: input.tags, body: bodyOf(input) });
  } catch (error) {
    console.error("[articles] create failed", error);
    return { status: "error", message: "The article could not be saved. Your writing was not changed." };
  }

  if (!draft) return { status: "error", message: "The article could not be saved. Your writing was not changed." };
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/article");
  if (String(formData.get("saveMode") ?? "draft") === "continue") redirect(`/admin/content/article/${draft.slug}/edit`);
  redirect("/admin/content/article");
}

export async function updateArticleAction(_previous: ArticleActionState, formData: FormData): Promise<ArticleActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const draftId = String(formData.get("draftId") ?? "").trim(), input = read(formData);
  if (!draftId || !input.title || !isValidDraftSlug(input.slug)) return { status: "error", message: "Check the article title and slug before saving." };
  const existing = await getArticleDraftBySlug(input.slug);
  if (existing && existing.id !== draftId) return { status: "error", message: "This article slug is already in use." };
  try {
    const draft = await updateArticleDraft(draftId, { contentType: "article", title: input.title, slug: input.slug, category: input.category || undefined, introduction: input.introduction || undefined, tags: input.tags, body: bodyOf(input) });
    if (!draft) return { status: "error", message: "Article draft not found." };
    revalidatePath("/admin/content"); revalidatePath("/admin/content/article"); revalidatePath(`/admin/content/article/${draft.slug}`); revalidatePath(`/articles/${draft.slug}`); return { status: "success", message: "Article saved." };
  } catch (error) { console.error("[articles] update failed", error); return { status: "error", message: "The article could not be saved. Your writing was not changed." }; }
}

export async function publishArticleAction(formData: FormData) { if (!(await requireAdminActionAccess())) return; const draftId = String(formData.get("draftId") ?? "").trim(), draft = await publishArticleDraft(draftId); if (!draft) return; revalidatePath("/admin/content"); revalidatePath("/admin/content/article"); revalidatePath(`/admin/content/article/${draft.slug}`); revalidatePath(`/articles/${draft.slug}`); revalidatePath("/articles"); revalidatePath("/search"); revalidatePath("/sitemap.xml"); redirect(`/admin/content/article/${draft.slug}`); }
export async function unpublishArticleAction(formData: FormData) { if (!(await requireAdminActionAccess())) return; const draftId = String(formData.get("draftId") ?? "").trim(), draft = await unpublishArticleDraft(draftId); if (!draft) return; revalidatePath("/admin/content"); revalidatePath("/admin/content/article"); revalidatePath(`/articles/${draft.slug}`); revalidatePath("/articles"); revalidatePath("/sitemap.xml"); redirect("/admin/content/article"); }
