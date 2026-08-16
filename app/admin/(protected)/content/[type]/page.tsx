import Link from "next/link";
import { ArrowLeft, Plus, FilePenLine, FileText, BookOpen } from "lucide-react";
import { listAdminContentItems, type AdminContentItem } from "@/app/admin/(protected)/content/admin-content";
import type { DraftContentType } from "@/app/lib/content-drafts";

const config: Record<DraftContentType, {
  label: string;
  singular: string;
  description: string;
  icon: typeof FilePenLine;
}> = {
  reflection: {
    label: "Reflections",
    singular: "Reflection",
    description: "Write and manage reflections on faith, Scripture, life, and eternal things.",
    icon: FilePenLine,
  },
  journal: {
    label: "Journals",
    singular: "Journal",
    description: "Write and manage personal journal entries and thoughtful observations.",
    icon: FileText,
  },
  book: {
    label: "Books",
    singular: "Book",
    description: "Manage your books, previews, and reading records.",
    icon: BookOpen,
  },
};

function statusLabel(item: AdminContentItem) {
  if (item.status === "published") {
    if (item.isStaticSource && !item.hasDraft) return "Published";
    return item.hasUnpublishedChanges ? "Published · unpublished changes" : "Published";
  }

  return item.isStaticSource ? "Draft · unpublished changes" : "Draft";
}

export default async function ContentTypeWorkspace({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "reflection" && type !== "journal" && type !== "book") {
    return null;
  }

  const contentType = type as DraftContentType;
  const current = config[contentType];
  const Icon = current.icon;
  const items = await listAdminContentItems(contentType);

  return (
    <section className="admin-content-workspace">
      <div className="admin-page-heading">
        <div>
          <Link className="admin-outline-link" href="/admin/content">
            <ArrowLeft size={14} /> Back to content
          </Link>
          <div className="admin-heading-with-icon">
            <span className="admin-icon"><Icon size={22} /></span>
            <div>
              <h1>{current.label}</h1>
              <p>{current.description}</p>
            </div>
          </div>
        </div>

        <Link
          className="button button-primary admin-content-add-button"
          href={`/admin/content/${contentType}/new`}
          aria-label={`Add ${current.singular}`}
          title={`Add ${current.singular}`}
        >
          <Plus size={18} />
          <span>Add</span>
        </Link>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{current.label}</h2>
            <p className="quiet-note">{items.length} item{items.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        {items.length ? (
          <div className="admin-content-grid">
            {items.map((item) => (
              <Link
                className="admin-content-card"
                href={`/admin/content/${item.contentType}/${item.slug}`}
                key={`${item.contentType}-${item.slug}`}
              >
                <div className="admin-content-card-media">
                  {item.image ? (
                    <img src={item.image} alt="" loading="lazy" />
                  ) : (
                    <div className="admin-content-card-media-placeholder" aria-hidden="true">
                      <Icon size={28} />
                    </div>
                  )}
                  <span className="admin-content-card-status">{statusLabel(item)}</span>
                </div>
                <div className="admin-content-card-body">
                  <p className="eyebrow">{item.category ?? current.singular}</p>
                  <h3>{item.title}</h3>
                  <div className="admin-content-card-meta">
                    {item.date ? <span>{item.date}</span> : null}
                    {item.readingTime ? <span>{item.readingTime}</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <Icon size={28} />
            <h3>No {current.label.toLowerCase()} yet</h3>
            <p>Create your first {current.singular.toLowerCase()} from this workspace.</p>
            <Link
              className="button button-primary"
              href={`/admin/content/${contentType}/new`}
            >
              <Plus size={17} />
              Add {current.singular}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
