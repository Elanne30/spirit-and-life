"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { createPodcastEpisode } from "@/app/lib/podcast-repository";
import { normalizeDraftSlug } from "@/app/lib/content-drafts";

function csv(value: FormDataEntryValue | null) { return String(value ?? "").split(",").map((item) => normalizeDraftSlug(item.trim())).filter(Boolean); }

export async function createPodcastEpisodeAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const title = String(formData.get("title") ?? "").trim(); const description = String(formData.get("description") ?? "").trim();
  const publishedAt = String(formData.get("publishedAt") ?? "").trim(); const audioUrl = String(formData.get("audioUrl") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim() || null; const transcript = String(formData.get("transcript") ?? "").trim() || null;
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim() || null; const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const topicSlugs = csv(formData.get("topicSlugs")); const seriesSlug = normalizeDraftSlug(String(formData.get("seriesSlug") ?? "").trim()) || null;
  const questionSlugs = csv(formData.get("questionSlugs")); const articleSlugs = csv(formData.get("articleSlugs")); const resourceSlugs = csv(formData.get("resourceSlugs"));
  if (!title || !publishedAt) return { ok: false as const, error: "Title and publication date are required." };
  const slug = normalizeDraftSlug(String(formData.get("slug") ?? title)) || "episode";
  try { await createPodcastEpisode({ slug, title, description, publishedAt, duration, coverImage, audioUrl: audioUrl || null, transcript, youtubeUrl, topicSlugs, seriesSlug, questionSlugs, articleSlugs, resourceSlugs });
    revalidatePath("/admin/podcast"); revalidatePath(`/admin/podcast/${slug}`); revalidatePath("/podcast"); revalidatePath(`/podcast/${slug}`); revalidatePath("/search"); return { ok: true as const, slug };
  } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : "Unable to save episode." }; }
}
