"use server";

import { requireAdminActionAccess } from "@/app/lib/admin-session";
import {
  createDraft,
  isValidDraftSlug,
  normalizeDraftSlug,
  updateDraft,
  type DraftContentType,
} from "@/app/lib/content-drafts";
import { revalidatePath } from "next/cache";

export type ContentDraftActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

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
    return { error: "The reflection sections could not be read." };
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
      body: {
        date: input.date,
        readingTime: input.readingTime,
        scripture: input.scripture,
        featured: input.featured,
        sections: input.sections,
      },
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
      body: {
        date: input.date,
        readingTime: input.readingTime,
        scripture: input.scripture,
        featured: input.featured,
        sections: input.sections,
      },
    });

    if (!draft) {
      return {
        status: "error",
        message: "Draft not found.",
      };
    }

    revalidatePath("/admin/content");

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
