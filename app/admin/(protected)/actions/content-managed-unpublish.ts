"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { getDraft, type DraftContentType } from "@/app/lib/content-drafts";

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

export async function unpublishManagedDraftAction(formData: FormData) {
  if (!(await requireAdminActionAccess())) return;

  const draftId = String(formData.get("draftId") ?? "").trim();
  if (!draftId) return;

  const draft = await getDraft(draftId);
  if (!draft) return;

  const currentSlug = draft.slug;
  const publishedSlug = typeof draft.published_snapshot?.slug === "string"
    ? draft.published_snapshot.slug.trim().toLowerCase()
    : "";

  await sql`
    UPDATE content_drafts
    SET status = 'draft', has_unpublished_changes = false, updated_at = now()
    WHERE id = ${draft.id}
  `;

  // Unpublishing is not deletion. The draft must remain accessible in Admin,
  // while its published version disappears from the public site because its
  // status is now "draft". Remove any stale deletion markers left by older
  // unpublish behavior as well.
  for (const slug of [currentSlug, publishedSlug]) {
    if (!slug) continue;
    await sql`
      DELETE FROM content_deletions
      WHERE content_type = ${draft.content_type} AND slug = ${slug}
    `;
    revalidatePublicRoutes(draft.content_type, slug);
  }

  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${draft.content_type}`);
  revalidatePath(`/admin/content/${draft.content_type}/${currentSlug}`);
}
