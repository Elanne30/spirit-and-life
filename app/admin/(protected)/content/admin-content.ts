import { reflections } from "@/app/data/reflections";
import { journals } from "@/app/data/journals";
import { books } from "@/app/data/books";
import { listAllDrafts, type ContentDraft, type DraftContentType } from "@/app/lib/content-drafts";

export type AdminContentStatus = "static" | "draft" | "published";

export type AdminContentItem = {
  contentType: DraftContentType;
  slug: string;
  title: string;
  category?: string;
  date?: string;
  updatedAt?: string;
  status: AdminContentStatus;
  hasDraft: boolean;
  draftId?: string;
  isStaticSource: boolean;
};

function staticItemsFor(contentType: DraftContentType): Array<{ contentSlug: string; title: string; category?: string; date?: string }> {
  if (contentType === "reflection") {
    return reflections;
  }

  if (contentType === "journal") {
    return journals;
  }

  return books.map((book) => ({ contentSlug: book.contentSlug, title: book.title, category: book.category, date: book.expectedPublication }));
}

// Combines the static source-of-truth articles with any database drafts (of
// any status) so the admin can see and open everything in one list.
export async function listAdminContentItems(contentType: DraftContentType): Promise<AdminContentItem[]> {
  const staticItems = staticItemsFor(contentType);
  const drafts = await listAllDrafts(contentType);
  const draftsBySlug = new Map(drafts.map((draft) => [draft.slug, draft]));

  const merged: AdminContentItem[] = staticItems.map((item) => {
    const draft = draftsBySlug.get(item.contentSlug);
    draftsBySlug.delete(item.contentSlug);

    return {
      contentType,
      slug: item.contentSlug,
      title: draft?.title ?? item.title,
      category: draft?.category ?? item.category,
      date: item.date,
      updatedAt: draft?.updated_at,
      status: draft ? (draft.status === "published" ? "published" : "draft") : "static",
      hasDraft: Boolean(draft),
      draftId: draft?.id,
      isStaticSource: true,
    };
  });

  const additional: AdminContentItem[] = Array.from(draftsBySlug.values()).map((draft: ContentDraft) => ({
    contentType,
    slug: draft.slug,
    title: draft.title,
    category: draft.category ?? undefined,
    updatedAt: draft.updated_at,
    status: draft.status === "published" ? "published" : "draft",
    hasDraft: true,
    draftId: draft.id,
    isStaticSource: false,
  }));

  return [...merged, ...additional];
}
