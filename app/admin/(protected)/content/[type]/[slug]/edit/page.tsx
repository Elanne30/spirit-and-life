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

  if (await isContentDeleted(contentType, slug)) {
    notFound();
  }

  const draft = await getDraftByTypeAndSlug(contentType, slug);

  if (!draft) {
    redirect(`/admin/content/${contentType}/${slug}`);
  }

  const current = config[contentType];
  const Icon = current.icon;

  return (
    <section className="admin-editor-page">
      <div className="admin-editor-header">
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

      <article className="admin-editor-card">
        <ContentEditForm draft={draft} />
      </article>
    </section>
  );
}
