import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleDraftBySlug } from "@/app/lib/content-drafts";
import { ArticlePublishForm } from "@/app/admin/(protected)/content/article-publish-form";

function sectionsOf(body: Record<string, unknown>) {
  const sections = Array.isArray(body.sections) ? body.sections : [];
  return sections.filter((section): section is { heading?: unknown; paragraphs?: unknown } => typeof section === "object" && section !== null);
}

export default async function ArticleAdminPreview({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = await getArticleDraftBySlug(slug);
  if (!draft) notFound();
  const sections = sectionsOf(draft.body);
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
        <p className="eyebrow">Preview</p>
        {draft.introduction ? <p className="lead">{draft.introduction}</p> : null}
        {sections.map((section, index) => <section key={index}>{typeof section.heading === "string" && section.heading ? <h2>{section.heading}</h2> : null}{Array.isArray(section.paragraphs) ? section.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>) : null}</section>)}
      </article>
    </section>
  );
}
