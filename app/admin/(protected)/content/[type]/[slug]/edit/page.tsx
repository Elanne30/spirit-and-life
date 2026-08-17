import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, FilePenLine, FileText } from "lucide-react";
import { getDraftByTypeAndSlug, isContentDeleted, normalizeDraftSlug, type DraftContentType } from "@/app/lib/content-drafts";
import { ContentEditForm } from "@/app/admin/(protected)/content/content-edit-form";
import { PublishForm } from "@/app/admin/(protected)/content/publish-form";

const config = {
  reflection: {
    label: "Edit Reflection",
    icon: FilePenLine,
  },
  journal: {
    label: "Edit Journal",
    icon: FileText,
  },
  book: {
    label: "Edit Book",
    icon: BookOpen,
  },
} as const;

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug: rawSlug } = await params;

  if (!(type in config)) {
    notFound();
  }

  const contentType = type as DraftContentType;
  const slug = normalizeDraftSlug(rawSlug);
  const draft = await getDraftByTypeAndSlug(contentType, slug);

  // A draft is an Admin-managed record and must remain editable even if an
  // older deletion marker exists from a previous unpublish implementation.
  if (!draft && (await isContentDeleted(contentType, slug))) {
    notFound();
  }

  if (!draft) {
    redirect(`/admin/content/${contentType}/${slug}`);
  }

  const current = config[contentType];
  const Icon = current.icon;

  return (
    <section
      className="admin-editor-page"
      style={{ width: "100%", maxWidth: "none", paddingBlock: "1rem 4rem" }}
    >
      <div
        className="admin-editor-header"
        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}
      >
        <div>
          <Link className="admin-outline-link" href={`/admin/content/${contentType}/${slug}`}>
            <ArrowLeft size={14} /> Back to preview
          </Link>
          <div className="admin-heading-with-icon">
            <span className="admin-icon"><Icon size={22} /></span>
            <div>
              <p className="eyebrow">Writing</p>
              <h1>{current.label}</h1>
              <p>{draft.title}</p>
            </div>
          </div>
        </div>

        <div className="admin-editor-actions">
          <PublishForm
            draftId={draft.id}
            status={draft.status}
            hasUnpublishedChanges={draft.has_unpublished_changes}
          />
        </div>
      </div>

      <article
        className="admin-editor-card"
        style={{ width: "100%", maxWidth: "none", padding: "clamp(1rem, 2vw, 2rem)", border: "1px solid var(--line)", background: "var(--surface)", boxShadow: "0 0.45rem 1.25rem var(--shadow)" }}
      >
        <ContentEditForm draft={draft} />
      </article>
    </section>
  );
}
