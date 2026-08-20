import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleDraftBySlug } from "@/app/lib/content-drafts";
import { ArticleArticle } from "@/app/components/article-article";
import { ArticlePublishForm } from "@/app/admin/(protected)/content/article-publish-form";

export default async function ArticleAdminPreview({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = await getArticleDraftBySlug(slug);
  if (!draft) notFound();

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <div className="admin-header-row">
          <div><p className="eyebrow">Article</p><h2>{draft.title}</h2><p>{draft.category ?? "Article"} · {typeof draft.body.date === "string" ? draft.body.date : ""}</p></div>
          <div className="admin-editor-actions"><Link className="button button-secondary" href="/admin/content/article">All Articles</Link><Link className="button button-secondary" href={`/admin/content/article/${draft.slug}/edit`}>Edit</Link><ArticlePublishForm draftId={draft.id} status={draft.status} hasUnpublishedChanges={draft.has_unpublished_changes} /></div>
        </div>
        <p className="quiet-note">{draft.status === "published" ? (draft.has_unpublished_changes ? "Published with unpublished changes." : "Published and live.") : "Unpublished draft. It is not visible on the public site."}</p>
      </article>
      <article className="admin-card admin-preview">
        <ArticleArticle article={draft} showBackLink={false} />
      </article>
    </section>
  );
}
