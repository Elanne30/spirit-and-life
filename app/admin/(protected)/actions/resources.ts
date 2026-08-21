"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { createDownloadableResourceRecord, updateDownloadableResourceStatus } from "@/app/lib/resource-repository";
import crypto from "node:crypto";

export async function createDownloadableResource(input: { title: string; description: string; kind: "PDF" | "Audio" | "Document"; fileUrl: string; fileName?: string; publishedAt?: string }) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const title = input.title.trim();
  if (!title || !input.fileUrl) return { ok: false as const, error: "Title and file are required." };
  const slug = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || `resource-${crypto.randomUUID().slice(0, 8)}`;
  try {
    await createDownloadableResourceRecord({ slug, title, description: input.description.trim(), kind: input.kind, fileUrl: input.fileUrl, fileName: input.fileName ?? null, publishedAt: input.publishedAt || new Date().toISOString() });
    revalidatePath("/admin/resources"); revalidatePath(`/admin/resources/${slug}`); revalidatePath("/resources");
    return { ok: true as const, slug };
  } catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : "Resource could not be saved." }; }
}

export async function setResourcePublished(slug: string, published: boolean) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  await updateDownloadableResourceStatus(slug, published ? "published" : "draft");
  revalidatePath("/admin/resources"); revalidatePath(`/admin/resources/${slug}`); revalidatePath("/resources");
  return { ok: true as const };
}
