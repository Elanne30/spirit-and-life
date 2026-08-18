import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleDraftBySlug } from "@/app/lib/content-drafts";
import { ArticleForm } from "@/app/admin/(protected)/content/article-form";
import { ArticlePublishForm } from "@/app/admin/(protected)/content/article-publish-form";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = await getArticleDraftBySlug(slug);
  if (!draft) notFound();
  return (
    <section className="admin-editor-page">
      <div className="admin-editor-header"><div><Link className="admin-outline-link" href={`/admin/content/article/${draft.slug}`}>← Back to preview</Link><p className="eyebrow">Writing</p><h1>Edit Article</h1><p>{draft.title}</p></div><ArticlePublishForm draftId={draft.id} status={draft.status} hasUnpublishedChanges={draft.has_unpublished_changes} /></div>
      <article className="admin-editor-card"><ArticleForm draft={draft} /></article>
    </section>
  );
}
