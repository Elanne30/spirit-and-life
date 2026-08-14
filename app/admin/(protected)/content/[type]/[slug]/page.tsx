import { notFound } from "next/navigation";
import Link from "next/link";
import { reflections } from "@/app/data/reflections";
import { journals } from "@/app/data/journals";
import { books } from "@/app/data/books";
import { getDraftByTypeAndSlug, normalizeDraftSlug, type DraftContentType } from "@/app/lib/content-drafts";
import { draftToReflectionPreview, draftToJournalPreview, draftToBookPreview } from "@/app/content/published-draft-adapter";
import { ReflectionArticle } from "@/app/components/reflection-article";
import { JournalArticle } from "@/app/components/journal-article";
import { BookArticle } from "@/app/components/book-article";
import { ContentEditForm } from "@/app/admin/(protected)/content/content-edit-form";
import { PublishForm } from "@/app/admin/(protected)/content/publish-form";
import { startEditingContentAction } from "@/app/admin/(protected)/actions/content";

const validTypes: DraftContentType[] = ["reflection", "journal", "book"];

export default async function AdminContentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; slug: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { type, slug: rawSlug } = await params;
  const { view } = await searchParams;

  if (!validTypes.includes(type as DraftContentType)) {
    notFound();
  }

  const contentType = type as DraftContentType;
  const slug = normalizeDraftSlug(rawSlug);

  const staticReflection = contentType === "reflection" ? reflections.find((item) => item.contentSlug === slug) : undefined;
  const staticJournal = contentType === "journal" ? journals.find((item) => item.contentSlug === slug) : undefined;
  const staticBook = contentType === "book" ? books.find((item) => item.contentSlug === slug) : undefined;
  const staticTitle = staticReflection?.title ?? staticJournal?.title ?? staticBook?.title;

  const draft = await getDraftByTypeAndSlug(contentType, slug);

  if (!staticTitle && !draft) {
    notFound();
  }

  const displayedReflection = contentType === "reflection" ? ((draft ? draftToReflectionPreview(draft) : null) ?? staticReflection) : undefined;
  const displayedJournal = contentType === "journal" ? ((draft ? draftToJournalPreview(draft) : null) ?? staticJournal) : undefined;
  const displayedBook = contentType === "book" ? ((draft ? draftToBookPreview(draft) : null) ?? staticBook) : undefined;

  const showEdit = view === "edit" && Boolean(draft);

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <div className="admin-header-row">
          <div>
            <p className="eyebrow">{contentType}</p>
            <h2>{draft?.title ?? staticTitle}</h2>
          </div>
          <Link className="button button-secondary" href="/admin/content">
            Back to content
          </Link>
        </div>

        <nav className="admin-tab-row" aria-label="Preview or edit">
          <Link className={`admin-tab${!showEdit ? " is-active" : ""}`} href={`/admin/content/${contentType}/${slug}`}>
            Preview
          </Link>
          {draft ? (
            <Link className={`admin-tab${showEdit ? " is-active" : ""}`} href={`/admin/content/${contentType}/${slug}?view=edit`}>
              Edit
            </Link>
          ) : (
            <form action={startEditingContentAction}>
              <input type="hidden" name="contentType" value={contentType} />
              <input type="hidden" name="slug" value={slug} />
              <button className="admin-tab" type="submit">
                Edit
              </button>
            </form>
          )}
        </nav>

        {draft ? (
          <p className="quiet-note">
            {draft.status === "published"
              ? draft.has_unpublished_changes
                ? "This content is published and live, but you have unpublished changes saved. Press Publish Changes to make them live."
                : "This content is published from the database and is live on the public site."
              : "This is an unpublished draft. Saving changes will not affect the public site until you Publish."}
          </p>
        ) : (
          <p className="quiet-note">This is existing static content. Click Edit to start managing it from the admin.</p>
        )}

        {draft ? <PublishForm draftId={draft.id} status={draft.status} hasUnpublishedChanges={draft.has_unpublished_changes} /> : null}
      </article>

      <article className="admin-card admin-preview">
        {showEdit && draft ? (
          <ContentEditForm draft={draft} />
        ) : (
          <>
            {displayedReflection ? <ReflectionArticle reflection={displayedReflection} showBackLink={false} /> : null}
            {displayedJournal ? <JournalArticle journal={displayedJournal} showBackLink={false} /> : null}
            {displayedBook ? <BookArticle book={displayedBook} showBackLink={false} /> : null}
          </>
        )}
      </article>
    </section>
  );
}
