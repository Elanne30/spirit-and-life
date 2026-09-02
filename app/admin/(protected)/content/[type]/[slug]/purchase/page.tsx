import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getDraftByTypeAndSlug } from "@/app/lib/content-drafts";
import { BookPurchaseForm } from "@/app/admin/(protected)/content/book-purchase-form";

export const dynamic = "force-dynamic";

export default async function BookPurchaseSettingsPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params;
  if (type !== "book") notFound();
  const draft = await getDraftByTypeAndSlug("book", slug);
  if (!draft) notFound();
  const body = draft.body as Record<string, unknown>;
  const options = Array.isArray(body.purchaseOptions) ? body.purchaseOptions.filter((item): item is { id: string; store: string; url: string; enabled: boolean } => typeof item === "object" && item !== null && typeof (item as Record<string, unknown>).store === "string" && typeof (item as Record<string, unknown>).url === "string").map((item, index) => ({ id: item.id || `store-${index + 1}`, store: item.store, url: item.url, enabled: item.enabled !== false })) : [];
  const paperbackStatus = body.paperbackStatus === "Available" ? "Available" : "Available Soon";
  const paperbackUrl = typeof body.paperbackUrl === "string" ? body.paperbackUrl : "";
  return <section className="admin-editor-page" style={{ width: "100%", maxWidth: "none", paddingBlock: "1rem 4rem" }}>
    <div className="admin-editor-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
      <div><Link className="admin-outline-link" href={`/admin/content/book/${draft.slug}`}><ArrowLeft size={14} /> Back to preview</Link><div className="admin-heading-with-icon"><span className="admin-icon"><ShoppingBag size={22} /></span><div><p className="eyebrow">Books</p><h1>Purchase Settings</h1><p>{draft.title}</p></div></div></div>
    </div>
    <article className="admin-editor-card" style={{ width: "100%", maxWidth: "none", padding: "clamp(1rem, 2vw, 2rem)", border: "1px solid var(--line)", background: "var(--surface)", boxShadow: "0 0.45rem 1.25rem var(--shadow)" }}><BookPurchaseForm draftId={draft.id} initialOptions={options} initialPaperbackStatus={paperbackStatus} initialPaperbackUrl={paperbackUrl} /></article>
  </section>;
}
