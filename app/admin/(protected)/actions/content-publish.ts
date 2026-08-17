"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { createDraft, getDraft, type DraftContentType } from "@/app/lib/content-drafts";
import { reflections } from "@/app/data/reflections";
import { journals } from "@/app/data/journals";
import { books } from "@/app/data/books";

function publicListRoute(contentType: DraftContentType) {
  return contentType === "reflection" ? "reflections" : contentType === "journal" ? "journals" : "books";
}

function revalidatePublicRoutes(contentType: DraftContentType, slug: string) {
  const listRoute = publicListRoute(contentType);
  revalidatePath(`/${listRoute}`);
  revalidatePath(`/${listRoute}/${slug}`);
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/sitemap.xml");
}

function findStaticSeed(contentType: DraftContentType, slug: string) {
  if (contentType === "reflection") return reflections.find((item) => item.contentSlug === slug);
  if (contentType === "journal") return journals.find((item) => item.contentSlug === slug);
  return books.find((item) => item.contentSlug === slug);
}

export async function unpublishContentAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;

  const draftId = String(formData.get("draftId") ?? "").trim();
  const contentType = String(formData.get("contentType") ?? "").trim() as DraftContentType;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (!( ["reflection", "journal", "book"] as DraftContentType[]).includes(contentType) || !slug) return;

  let draft = draftId ? await getDraft(draftId) : null;

  if (draft && draft.status === "published") {
    await sql`
      UPDATE content_drafts
      SET status = 'draft', has_unpublished_changes = false, updated_at = now()
      WHERE id = ${draft.id} AND status = 'published'
    `;
  } else if (!draft) {
    const seed = findStaticSeed(contentType, slug);
    if (!seed) return;

    const seedRecord = seed as Record<string, unknown>;
    draft = await createDraft({
      contentType,
      title: String(seedRecord.title ?? ""),
      slug,
      introduction: typeof seedRecord.introduction === "string"
        ? seedRecord.introduction
        : typeof seedRecord.description === "string"
          ? seedRecord.description
          : undefined,
      category: typeof seedRecord.category === "string" ? seedRecord.category : undefined,
      tags: Array.isArray(seedRecord.tags) ? seedRecord.tags as string[] : [],
      imageReference: typeof seedRecord.image === "string"
        ? seedRecord.image
        : typeof seedRecord.cover === "string"
          ? seedRecord.cover
          : undefined,
      body: typeof seedRecord.body === "object" && seedRecord.body !== null
        ? seedRecord.body as Record<string, unknown>
        : {},
    });
  } else {
    return;
  }

  await sql`
    INSERT INTO content_deletions (content_type, slug, deleted_at)
    VALUES (${contentType}, ${slug}, now())
    ON CONFLICT (content_type, slug) DO UPDATE SET deleted_at = EXCLUDED.deleted_at
  `;

  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${contentType}`);
  revalidatePath(`/admin/content/${contentType}/${slug}`);
  revalidatePublicRoutes(contentType, slug);
  redirect(`/admin/content/${contentType}`);
}
