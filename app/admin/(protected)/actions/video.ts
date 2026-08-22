"use server";

import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { createVideo } from "@/app/lib/video-repository";

export async function createVideoAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!title || !slug) return { ok: false as const, error: "Title and slug are required." };

  const destinations = formData.getAll("destination")
    .map((value) => String(value).trim())
    .filter(Boolean);

  try {
    const video = await createVideo({
      title,
      slug,
      description: String(formData.get("description") ?? "").trim() || null,
      videoUrl: String(formData.get("videoUrl") ?? "").trim() || null,
      thumbnailUrl: String(formData.get("thumbnailUrl") ?? "").trim() || null,
      transcript: String(formData.get("transcript") ?? "").trim() || null,
      youtubeUrl: String(formData.get("youtubeUrl") ?? "").trim() || null,
      status: String(formData.get("status") ?? "draft") as "draft" | "published" | "archived",
      publishedAt: String(formData.get("publishedAt") ?? "").trim() || null,
      destinations,
    });
    return { ok: true as const, id: video.id };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Video could not be saved." };
  }
}
