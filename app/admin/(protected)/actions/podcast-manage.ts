"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { deletePodcastEpisode, updatePodcastEpisode, updatePodcastEpisodeStatus } from "@/app/lib/podcast-repository";

export async function updatePodcastEpisodeAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false as const, error: "Missing episode." };
  await updatePodcastEpisode(slug, { title: String(formData.get("title") ?? "").trim(), description: String(formData.get("description") ?? "").trim(), publishedAt: String(formData.get("publishedAt") ?? "").trim(), duration: String(formData.get("duration") ?? "").trim() || null, audioUrl: String(formData.get("audioUrl") ?? "").trim() || null, transcript: String(formData.get("transcript") ?? "").trim() || null });
  revalidatePath("/admin/podcast"); revalidatePath(`/admin/podcast/${slug}`); revalidatePath("/podcast"); revalidatePath(`/podcast/${slug}`);
  return { ok: true as const };
}

export async function setPodcastEpisodeStatusAction(formData: FormData): Promise<void> {
  if (!(await requireAdminActionAccess())) return;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  const status = String(formData.get("status") ?? "draft") === "published" ? "published" : "draft";
  await updatePodcastEpisodeStatus(slug, status);
  revalidatePath("/admin/podcast"); revalidatePath(`/admin/podcast/${slug}`); revalidatePath("/podcast"); revalidatePath(`/podcast/${slug}`);
}

export async function deletePodcastEpisodeAction(formData: FormData): Promise<void> {
  if (!(await requireAdminActionAccess())) return;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  await deletePodcastEpisode(slug);
  revalidatePath("/admin/podcast"); revalidatePath("/podcast");
}
