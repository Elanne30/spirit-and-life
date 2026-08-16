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
import { normalizeRichTextDocument, richTextToLegacySections, type RichTextDocument } from "@/app/content/article-rich-text";

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
      richText: RichTextDocument | undefined;
      label: string;
      subtitle: string;
      expectedPublication: string;
      author: string;
      publisher: string;
      length: string;
      tableOfContents: string[];
      imageReference: string;
      bookNotes: string;
      submitIntent: "save" | "continue";
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
  const bookNotes = String(formData.get("bookNotes") ?? "").trim();
  const submitIntent = formData.get("submitIntent") === "continue" ? "continue" : "save";

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
  const rawRichText = String(formData.get("richText") ?? "").trim();

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

  let richText: RichTextDocument | undefined;
  if (rawRichText) {
    try {
      richText = normalizeRichTextDocument(JSON.parse(rawRichText)) ?? undefined;
    } catch {
      return { error: "The rich text content could not be read." };
    }
    if (!richText) return { error: "The rich text content contains unsupported formatting." };
    sections = richTextToLegacySections(richText);
  }

  if (!["reflection", "journal", "book"].includes(contentType)) {
    return { error: "Choose a valid content type." };
  }

  if (richText && contentType !== "reflection" && contentType !== "journal") {
    return { error: "Rich text body content is currently available for reflections and journals only." };
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
    richText,
    label,
    subtitle,
    expectedPublication,
    author,
    publisher,
    length,
    tableOfContents,
    imageReference,
    bookNotes,
    submitIntent,
  };
}

function bodyFromInput(input: Exclude<ParsedDraftInput, { error: string }>) {
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
    bookNotes: input.bookNotes,
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
    const draft = await createDraft({
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
    revalidatePath(`/admin/content/${input.contentType}`);

    if (input.submitIntent === "continue" && draft) {
      redirect(`/admin/content/${draft.content_type}/${draft.slug}?view=edit`);
    }

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

    return { status: "success", message: "Changes saved." };
  } catch (error) {
    console.error(
      "[content-drafts] Update draft failed.",
      error instanceof Error ? error.message : "Unknown error",
    );

    return {
      status: "error",
      message: "The changes could not be saved. The draft remains unchanged.",
    };
  }
}

export async function publishDraftAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) redirect("/admin/login");

  const draftId = String(formData.get("draftId") ?? "").trim();
  if (!draftId) redirect("/admin/content");

  await publishDraft(draftId);
  revalidatePath("/admin/content");
  redirect("/admin/content");
}

export async function startEditingContentAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) redirect("/admin/login");

  const contentType = String(formData.get("contentType") ?? "").trim() as DraftContentType;
  const slug = normalizeDraftSlug(String(formData.get("slug") ?? ""));

  if (!["reflection", "journal", "book"].includes(contentType) || !slug) {
    redirect("/admin/content");
  }

  try {
    const existingDraft = await getDraftByTypeAndSlug(contentType, slug);
    if (existingDraft) redirect(`/admin/content/${contentType}/${existingDraft.slug}?view=edit`);

    const source =
      contentType === "reflection"
        ? reflections.find((item) => item.contentSlug === slug)
        : contentType === "journal"
          ? journals.find((item) => item.contentSlug === slug)
          : books.find((item) => item.contentSlug === slug);

    if (!source) redirect("/admin/content");

    const sourceBody =
      contentType === "reflection"
        ? {
            date: source.date,
            readingTime: source.readingTime,
            scripture: source.scripture,
            featured: source.featured,
            sections: source.sections,
            label: "",
            subtitle: "",
            expectedPublication: "",
            author: "",
            publisher: "",
            length: "",
            tableOfContents: [],
            bookNotes: "",
          }
        : contentType === "journal"
          ? {
              date: source.date,
              readingTime: "",
              scripture: "",
              featured: false,
              sections: source.sections,
              label: source.label,
              subtitle: "",
              expectedPublication: "",
              author: "",
              publisher: "",
              length: "",
              tableOfContents: [],
              bookNotes: "",
            }
          : {
              date: "",
              readingTime: "",
              scripture: "",
              featured: false,
              sections: [],
              label: "",
              subtitle: source.subtitle,
              expectedPublication: source.expectedPublication,
              author: source.author,
              publisher: source.publisher,
              length: source.length,
              tableOfContents: source.tableOfContents,
              bookNotes: "",
            };

    const draft = await createDraft({
      contentType,
      title: source.title,
      slug,
      introduction: source.introduction,
      category: source.category,
      tags: source.tags,
      imageReference: source.imageReference,
      body: sourceBody,
    });

    revalidatePath(`/admin/content/${contentType}/${slug}`);
    redirect(`/admin/content/${contentType}/${draft.slug}?view=edit`);
  } catch (error) {
    console.error("[content-drafts] Start editing failed.", error instanceof Error ? error.message : "Unknown error");
    redirect(`/admin/content/${contentType}/${slug}`);
  }
}

export async function deleteContentAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) redirect("/admin/login");

  const contentType = String(formData.get("contentType") ?? "").trim() as DraftContentType;
  const slug = normalizeDraftSlug(String(formData.get("slug") ?? ""));

  if (!["reflection", "journal", "book"].includes(contentType) || !slug) {
    redirect("/admin/content");
  }

  await deleteContent(contentType, slug);
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${contentType}`);
  redirect(`/admin/content/${contentType}`);
}
