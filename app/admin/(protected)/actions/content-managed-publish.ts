"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { getDraft, publishDraft, type DraftContentType } from "@/app/lib/content-drafts";
import type { ContentDraftActionState } from "@/app/admin/(protected)/actions/content";

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

async function suppressStaticSlug(contentType: DraftContentType, slug: string) {
  if (!slug) return;
  await sql`
    INSERT INTO content_deletions (content_type, slug, deleted_at)
    VALUES (${contentType}, ${slug}, now())
    ON CONFLICT (content_type, slug) DO UPDATE SET deleted_at = EXCLUDED.deleted_at
  `;
}

export async function publishManagedDraftAction(
  _previousState: ContentDraftActionState,
  formData: FormData,
): Promise<ContentDraftActionState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };

  const draftId = String(formData.get("draftId") ?? "").trim();
  if (!draftId) return { status: "error", message: "A draft id is required to publish." };

  const draftBeforePublish = await getDraft(draftId);
  if (!draftBeforePublish) return { status: "error", message: "Draft not found." };

  try {
    const previousPublishedSlug = typeof draftBeforePublish.published_snapshot?.slug === "string"
      ? draftBeforePublish.published_snapshot.slug.trim().toLowerCase()
      : "";

    if (previousPublishedSlug && previousPublishedSlug !== draftBeforePublish.slug) {
      await suppressStaticSlug(draftBeforePublish.content_type, previousPublishedSlug);
      revalidatePublicRoutes(draftBeforePublish.content_type, previousPublishedSlug);
    }

    const published = await publishDraft(draftId);
    if (!published) return { status: "error", message: "Draft not found." };

    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/${published.content_type}`);
    revalidatePath(`/admin/content/${published.content_type}/${published.slug}`);
    revalidatePublicRoutes(published.content_type, published.slug);

    return { status: "success", message: "Published. It is now live on the public website." };
  } catch (error) {
    console.error("[content-drafts] Managed publish failed.", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: "That content could not be published." };
  }
}
