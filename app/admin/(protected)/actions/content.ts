"use server";

import { redirect } from "next/navigation";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import {
  createDraft,
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

export type ContentDraftActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageSize = 8 * 1024 * 1024;

export async function uploadContentImageAction(_previousState: ContentDraftActionState, formData: FormData): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) {
    return { status: "error", message: "Unauthorized." };
  }

  const draftId = String(formData.get("draftId") ?? "").trim();
  const file = formData.get("image");

  if (!draftId || !(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose an image before uploading." };
  }

  if (!allowedImageTypes.has(file.type)) {
    return { status: "error", message: "Use a JPG, PNG, WebP, or GIF image." };
  }

  if (file.size > maxImageSize) {
    return { status: "error", message: "Images must be 8 MB or smaller." };
  }

  try {
    const draft = await import("@/app/lib/content-drafts").then(({ getDraft }) => getDraft(draftId));
    if (!draft) return { status: "error", message: "Draft not found." };

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const blob = await put(`content/${draft.content_type}/${draft.slug}-${Date.now()}.${extension}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    const updated = await updateDraftImage(draftId, blob.url);
    if (!updated) return { status: "error", message: "Draft not found." };

    revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`);
    revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}?view=edit`);
    revalidatePath(`/${draft.content_type === "reflection" ? "reflections" : draft.content_type === "journal" ? "journals" : "books"}/${draft.slug}`);
    return { status: "success", message: "Image uploaded and saved." };
  } catch (error) {
    console.error("[content-images] Upload failed.", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: "The image could not be uploaded. Your existing image is unchanged." };
  }
}

type ParsedDraftInput =
  | {
      draftId: string;
      contentType: DraftContentType;
      title: string;
      slug: string;
      date: string;
      readingTime: string;
      scripture: string;
      introduction: string;
      category: string;
      tags: string[];
      featured: boolean;
      sections: Array<{ heading: string; paragraphs: string[] }>;
      label: string;
      subtitle: string;
      expectedPublication: string;
      author: string;
      publisher: string;
      length: string;
      tableOfContents: string[];
      imageReference: string;
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

  const tableOfContents = String(formData.get("tableOfContents") ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const featured = String(formData.get("featured") ?? "") === "yes";
  const rawSections = String(formData.get("sections") ?? "[]");

  let sections: Array<{ heading: string; paragraphs: string[] }> = [];

  try {
    const parsed = JSON.parse(rawSections);

    if (Array.isArray(parsed)) {
      sections = parsed
        .filter(
          (section): section is { heading?: unknown; paragraphs?: unknown } =>
            typeof section === "object" &&
            section !== null,
        )
        .map((section) => ({
          heading: typeof section.heading === "string" ? section.heading.trim() : "",
          paragraphs: Array.isArray(section.paragraphs)
            ? section.paragraphs
                .filter((paragraph): paragraph is string => typeof paragraph === "string")
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
            : [],
        }))
        .filter((section) => section.heading || section.paragraphs.length);
    }
  } catch {
    return { error: "The content sections could not be read." };
  }

  if (!(["reflection", "journal", "book"] as DraftContentType[]).includes(contentType)) {
    return { error: "Choose a valid content type." };
  }

  if (!title) {
    return { error: "A title is required." };
  }

  if (!isValidDraftSlug(slug)) {
    return {
      error: "Use a lowercase slug with letters, numbers, and single hyphens only.",
    };
  }

  return {
    draftId,
    contentType,
    title,
    slug,
    date,
    readingTime,
    scripture,
    introduction,
    category,
    tags,
    featured,
    sections,
    label,
    subtitle,
    expectedPublication,
    author,
    publisher,
    length,
    tableOfContents,
    imageReference,
  };
}

function bodyFromInput(input: Exclude<ParsedDraftInput, { error: string }>) {
  return {
    date: input.date,
    readingTime: input.readingTime,
    scripture: input.scripture,
    featured: input.featured,
    sections: input.sections,
    label: input.label,
    subtitle: input.subtitle,
    expectedPublication: input.expectedPublication,
    author: input.author,
    publisher: input.publisher,
    length: input.length,
    tableOfContents: input.tableOfContents,
  };
}

export async function createDraftAction(
  _previousState: ContentDraftActionState,
  formData: FormData,
): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) {
    return { status: "error", message: "Unauthorized." };
  }

  const input = readDraftInput(formData);

  if ("error" in input) {
    return { status: "error", message: input.error };
  }

  try {
    await createDraft({
      contentType: input.contentType,
      title: input.title,
      slug: input.slug,
      introduction: input.introduction || undefined,
      category: input.category || undefined,
      tags: input.tags,
      imageReference: input.imageReference || undefined,
      body: bodyFromInput(input),
    });

    revalidatePath("/admin/content");

    return {
      status: "success",
      message: "Draft saved.",
    };
  } catch (error) {
    console.error(
      "[content-drafts] Create draft failed.",
      error instanceof Error ? error.message : "Unknown error",
    );

    return {
      status: "error",
      message: "That draft slug is already in use or could not be saved.",
    };
  }
}

export async function updateDraftAction(
  _previousState: ContentDraftActionState,
  formData: FormData,
): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) {
    return { status: "error", message: "Unauthorized." };
  }

  const input = readDraftInput(formData);

  if ("error" in input) {
    return { status: "error", message: input.error };
  }

  if (!input.draftId) {
    return {
      status: "error",
      message: "A draft id is required for updates.",
    };
  }

  try {
    const draft = await updateDraft(input.draftId, {
      contentType: input.contentType,
      title: input.title,
      slug: input.slug,
      introduction: input.introduction || undefined,
      category: input.category || undefined,
      tags: input.tags,
      imageReference: input.imageReference || undefined,
      body: bodyFromInput(input),
    });

    if (!draft) {
      return {
        status: "error",
        message: "Draft not found.",
      };
    }

    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`);

    return {
      status: "success",
      message: "Draft updated.",
    };
  } catch (error) {
    console.error(
      "[content-drafts] Update draft failed.",
      error instanceof Error ? error.message : "Unknown error",
    );

    return {
      status: "error",
      message: "That draft slug is already in use or could not be updated.",
    };
  }
}

function publicListRoute(contentType: DraftContentType) {
  return contentType === "reflection" ? "reflections" : contentType === "journal" ? "journals" : "books";
}

function revalidatePublicRoutes(contentType: DraftContentType, slug: string) {
  const listRoute = publicListRoute(contentType);
  revalidatePath(`/${listRoute}`);
  revalidatePath(`/${listRoute}/${slug}`);
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/sitemap.xml");
}

export async function publishDraftAction(
  _previousState: ContentDraftActionState,
  formData: FormData,
): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) {
    return { status: "error", message: "Unauthorized." };
  }

  const draftId = String(formData.get("draftId") ?? "").trim();

  if (!draftId) {
    return { status: "error", message: "A draft id is required to publish." };
  }

  try {
    const draft = await publishDraft(draftId);

    if (!draft) {
      return { status: "error", message: "Draft not found." };
    }

    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/${draft.content_type}/${draft.slug}`);
    revalidatePublicRoutes(draft.content_type, draft.slug);

    return {
      status: "success",
      message: "Published. It is now live on the public website.",
    };
  } catch (error) {
    console.error(
      "[content-drafts] Publish draft failed.",
      error instanceof Error ? error.message : "Unknown error",
    );

    return { status: "error", message: "That content could not be published." };
  }
}

function findStaticSeed(contentType: DraftContentType, slug: string) {
  if (contentType === "reflection") {
    return reflections.find((item) => item.contentSlug === slug);
  }

  if (contentType === "journal") {
    return journals.find((item) => item.contentSlug === slug);
  }

  return books.find((item) => item.contentSlug === slug);
}

// Seeds a database draft from an existing static article so it can be edited
// without ever changing the public version until the draft is published.
export async function startEditingContentAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) {
    return;
  }

  const contentType = String(formData.get("contentType") ?? "").trim() as DraftContentType;
  const slug = normalizeDraftSlug(String(formData.get("slug") ?? ""));

  if (!(["reflection", "journal", "book"] as DraftContentType[]).includes(contentType) || !slug) {
    return;
  }

  const existingDraft = await getDraftByTypeAndSlug(contentType, slug);

  if (!existingDraft) {
    const seed = findStaticSeed(contentType, slug);

    if (seed) {
      const seedRecord = seed as Record<string, unknown>;

      await createDraft({
        contentType,
        title: String(seedRecord.title ?? ""),
        slug,
        introduction: typeof seedRecord.introduction === "string" ? seedRecord.introduction : (typeof seedRecord.description === "string" ? seedRecord.description : undefined),
        category: typeof seedRecord.category === "string" ? seedRecord.category : undefined,
        tags: Array.isArray(seedRecord.tags) ? (seedRecord.tags as string[]) : [],
        imageReference: typeof seedRecord.image === "string" ? seedRecord.image : (typeof seedRecord.cover === "string" ? seedRecord.cover : undefined),
        body: {
          date: seedRecord.date ?? "",
          readingTime: seedRecord.readingTime ?? "",
          scripture: seedRecord.scripture ?? "",
          featured: seedRecord.featured === true,
          sections: Array.isArray(seedRecord.sections) ? seedRecord.sections : [],
          label: seedRecord.label ?? "",
          subtitle: seedRecord.subtitle ?? "",
          expectedPublication: seedRecord.expectedPublication ?? "",
          author: seedRecord.author ?? "",
          publisher: seedRecord.publisher ?? "",
          length: seedRecord.length ?? "",
          tableOfContents: Array.isArray(seedRecord.tableOfContents) ? seedRecord.tableOfContents : [],
          relatedReflectionSlugs: seedRecord.relatedReflectionSlugs ?? [],
          relatedJournalSlugs: seedRecord.relatedJournalSlugs ?? [],
          relatedBookSlugs: seedRecord.relatedBookSlugs ?? [],
          relatedStudyPlanDates: seedRecord.relatedStudyPlanDates ?? [],
        },
      });
    } else {
      // No static seed and no existing draft: nothing to edit.
      return;
    }
  }

  revalidatePath("/admin/content");
  redirect(`/admin/content/${contentType}/${slug}?view=edit`);
}
