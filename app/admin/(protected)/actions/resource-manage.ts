"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { deleteDownloadableResource, updateDownloadableResource, updateDownloadableResourceStatus } from "@/app/lib/resource-repository";

export async function updateDownloadableResourceAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false as const, error: "Missing resource." };
  await updateDownloadableResource(slug, { title: String(formData.get("title") ?? "").trim(), description: String(formData.get("description") ?? "").trim(), kind: String(formData.get("kind") ?? "PDF") as "PDF" | "Audio" | "Document", publishedAt: String(formData.get("publishedAt") ?? "").trim() });
  revalidatePath("/admin/resources"); revalidatePath(`/admin/resources/${slug}`); revalidatePath("/resources");
  return { ok: true as const };
}

export async function setDownloadableResourceStatusAction(formData: FormData): Promise<void> {
  if (!(await requireAdminActionAccess())) return;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  const status = String(formData.get("status") ?? "draft") === "published" ? "published" : "draft";
  await updateDownloadableResourceStatus(slug, status);
  revalidatePath("/admin/resources"); revalidatePath(`/admin/resources/${slug}`); revalidatePath("/resources"); revalidatePath(`/resources/${slug}`);
}

export async function deleteDownloadableResourceAction(formData: FormData): Promise<void> {
  if (!(await requireAdminActionAccess())) return;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  await deleteDownloadableResource(slug);
  revalidatePath("/admin/resources"); revalidatePath("/resources");
}
