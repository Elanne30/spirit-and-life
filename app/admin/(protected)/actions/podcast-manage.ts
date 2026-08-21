"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { deletePodcastEpisode, updatePodcastEpisode, updatePodcastEpisodeStatus } from "@/app/lib/podcast-repository";
import { normalizeDraftSlug } from "@/app/lib/content-drafts";

function csv(value: FormDataEntryValue | null) { return String(value ?? "").split(",").map((item) => normalizeDraftSlug(item.trim())).filter(Boolean); }

export async function updatePodcastEpisodeAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false as const, error: "Missing episode." };
  const topicSlugs = csv(formData.get("topicSlugs"));
  const seriesSlug = normalizeDraftSlug(String(formData.get("seriesSlug") ?? "").trim()) || null;
  await updatePodcastEpisode(slug, {
    title: String(formData.get("title") ?? "").trim(), description: String(formData.get("description") ?? "").trim(),
    publishedAt: String(formData.get("publishedAt") ?? "").trim(), duration: String(formData.get("duration") ?? "").trim() || null,
    audioUrl: String(formData.get("audioUrl") ?? "").trim() || null, transcript: String(formData.get("transcript") ?? "").trim() || null,
    youtubeUrl: String(formData.get("youtubeUrl") ?? "").trim() || null, topicSlugs, seriesSlug,
    questionSlugs: csv(formData.get("questionSlugs")), articleSlugs: csv(formData.get("articleSlugs")), resourceSlugs: csv(formData.get("resourceSlugs")),
  });
  revalidatePath("/admin/podcast"); revalidatePath(`/admin/podcast/${slug}`); revalidatePath("/podcast"); revalidatePath(`/podcast/${slug}`); revalidatePath("/search");
  return { ok: true as const };
}

export async function savePodcastEpisodeAction(formData: FormData): Promise<void> { await updatePodcastEpisodeAction(formData); }
export async function setPodcastEpisodeStatusAction(formData: FormData): Promise<void> { if (!(await requireAdminActionAccess())) return; const slug = String(formData.get("slug") ?? "").trim(); if (!slug) return; const status = String(formData.get("status") ?? "draft") === "published" ? "published" : "draft"; await updatePodcastEpisodeStatus(slug, status); revalidatePath("/admin/podcast"); revalidatePath(`/admin/podcast/${slug}`); revalidatePath("/podcast"); revalidatePath(`/podcast/${slug}`); }
export async function deletePodcastEpisodeAction(formData: FormData): Promise<void> { if (!(await requireAdminActionAccess())) return; const slug = String(formData.get("slug") ?? "").trim(); if (!slug) return; await deletePodcastEpisode(slug); revalidatePath("/admin/podcast"); revalidatePath("/podcast"); }
