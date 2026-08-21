"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { createPodcastEpisode } from "@/app/lib/podcast-repository";
import { normalizeDraftSlug } from "@/app/lib/content-drafts";

export async function createPodcastEpisodeAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const publishedAt = String(formData.get("publishedAt") ?? "").trim();
  const audioUrl = String(formData.get("audioUrl") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim() || null;
  const transcript = String(formData.get("transcript") ?? "").trim() || null;
  if (!title || !publishedAt) return { ok: false as const, error: "Title and publication date are required." };
  const slug = normalizeDraftSlug(String(formData.get("slug") ?? title)) || "episode";
  try {
    await createPodcastEpisode({ slug, title, description, publishedAt, duration, coverImage: null, audioUrl: audioUrl || null, transcript, topicSlugs: [], seriesSlug: null, questionSlugs: [] });
    revalidatePath("/podcast");
    revalidatePath("/search");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Unable to save episode." };
  }
}
