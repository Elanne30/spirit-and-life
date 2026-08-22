"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { getVideoBySlug, updateVideo } from "@/app/lib/video-repository";

function revalidateVideoPaths(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/admin/videos");
  revalidatePath(`/resources/video/${slug}`);
  revalidatePath("/resources");
  revalidatePath("/articles");
  revalidatePath("/reflections");
  revalidatePath("/journals");
  revalidatePath("/");
}

export async function publishVideoAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!slug) return;

  const video = await getVideoBySlug(slug);
  if (!video) return;

  const updated = await updateVideo(video.id, {
    ...video,
    status: "published",
    publishedAt: video.publishedAt ?? new Date().toISOString(),
  });
  if (!updated) return;

  revalidateVideoPaths(updated.slug);
  redirect("/admin/videos");
}

export async function unpublishVideoAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!slug) return;

  const video = await getVideoBySlug(slug);
  if (!video) return;

  const updated = await updateVideo(video.id, {
    ...video,
    status: "draft",
    publishedAt: null,
  });
  if (!updated) return;

  revalidateVideoPaths(updated.slug);
  redirect("/admin/videos");
}
