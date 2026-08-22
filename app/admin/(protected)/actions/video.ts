"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { createVideo, deleteVideo, updateVideo, type VideoStatus } from "@/app/lib/video-repository";

function readDestinations(formData: FormData) {
  return formData.getAll("destination").map((value) => String(value).trim()).filter(Boolean);
}

function readStatus(value: unknown): VideoStatus {
  const status = String(value ?? "draft");
  return status === "published" || status === "archived" ? status : "draft";
}

function readInput(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!title || !slug) return { error: "Title and slug are required." } as const;
  return {
    title,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    videoUrl: String(formData.get("videoUrl") ?? "").trim() || null,
    thumbnailUrl: String(formData.get("thumbnailUrl") ?? "").trim() || null,
    transcript: String(formData.get("transcript") ?? "").trim() || null,
    youtubeUrl: String(formData.get("youtubeUrl") ?? "").trim() || null,
    duration: String(formData.get("duration") ?? "").trim() || null,
    status: readStatus(formData.get("status")),
    publishedAt: String(formData.get("publishedAt") ?? "").trim() || null,
    destinations: readDestinations(formData),
  };
}

function revalidateVideoPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/admin/videos");
  if (slug) revalidatePath(`/resources/video/${slug}`);
  revalidatePath("/resources");
  revalidatePath("/articles");
  revalidatePath("/reflections");
  revalidatePath("/journals");
  revalidatePath("/");
}

export async function createVideoAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const input = readInput(formData);
  if ("error" in input) return { ok: false as const, error: input.error };
  try {
    const video = await createVideo(input);
    revalidateVideoPaths(video.slug);
    return { ok: true as const, id: video.id };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Video could not be saved." };
  }
}

export async function updateVideoAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const id = String(formData.get("id") ?? "").trim();
  const oldSlug = String(formData.get("oldSlug") ?? "").trim();
  if (!id) return { ok: false as const, error: "Video id is required." };
  const input = readInput(formData);
  if ("error" in input) return { ok: false as const, error: input.error };
  try {
    const video = await updateVideo(id, input);
    if (!video) return { ok: false as const, error: "Video not found." };
    revalidateVideoPaths(oldSlug);
    revalidateVideoPaths(video.slug);
    return { ok: true as const, id: video.id };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Video could not be updated." };
  }
}

export async function deleteVideoAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;
  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!id) return;
  await deleteVideo(id);
  revalidateVideoPaths(slug);
  redirect("/admin/videos");
}
