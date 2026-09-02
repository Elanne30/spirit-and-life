"use server";

import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { getDraft, updateDraft, type ContentDraft } from "@/app/lib/content-drafts";

type PurchaseOption = { id: string; store: string; url: string; enabled: boolean };

function parseOptions(raw: string): PurchaseOption[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, index) => ({ id: typeof item?.id === "string" && item.id ? item.id : `store-${index + 1}`, store: typeof item?.store === "string" ? item.store.trim() : "", url: typeof item?.url === "string" ? item.url.trim() : "", enabled: item?.enabled !== false })).filter((item) => item.store && /^https?:\/\//i.test(item.url));
  } catch { return []; }
}

export async function saveBookPurchaseSettings(formData: FormData) {
  if (!(await requireAdminActionAccess())) return { ok: false, message: "Unauthorized." };
  const draftId = String(formData.get("draftId") ?? "").trim();
  const purchaseOptions = parseOptions(String(formData.get("purchaseOptions") ?? "[]"));
  const paperbackStatus = String(formData.get("paperbackStatus") ?? "Available Soon") === "Available" ? "Available" : "Available Soon";
  const paperbackUrl = String(formData.get("paperbackUrl") ?? "").trim();
  if (!draftId) return { ok: false, message: "Book record not found." };
  if (paperbackUrl && !/^https?:\/\//i.test(paperbackUrl)) return { ok: false, message: "Paperback URL must begin with http:// or https://." };
  const draft = await getDraft(draftId);
  if (!draft || draft.content_type !== "book") return { ok: false, message: "Book record not found." };
  const body = { ...draft.body, purchaseOptions, paperbackStatus, paperbackUrl: paperbackUrl || undefined };
  const updated = await updateDraft(draftId, { contentType: "book", title: draft.title, slug: draft.slug, introduction: draft.introduction ?? undefined, category: draft.category ?? undefined, tags: draft.tags, imageReference: draft.image_reference ?? undefined, body });
  if (!updated) return { ok: false, message: "Book record not found." };
  revalidatePath(`/admin/content/book/${draft.slug}`);
  revalidatePath(`/admin/content/book/${draft.slug}/edit`);
  revalidatePath(`/books/${draft.slug}`);
  revalidatePath(`/books/${draft.slug}/get`);
  revalidatePath("/books");
  return { ok: true, message: "Purchase settings saved." };
}
