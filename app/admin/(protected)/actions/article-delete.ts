"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { deleteContent, normalizeDraftSlug, type DraftContentType } from "@/app/lib/content-drafts";

export async function deleteArticleAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;
  const slug = normalizeDraftSlug(String(formData.get("slug") ?? "").trim());
  if (!slug) return;

  await deleteContent("article" as DraftContentType, slug);
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/article");
  revalidatePath(`/articles/${slug}`);
  revalidatePath("/articles");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/sitemap.xml");
  redirect("/admin/content/article");
}
