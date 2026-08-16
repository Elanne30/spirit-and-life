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
          className="button button-primary"
          href={`/admin/content/${contentType}/new`}
          aria-label={`Add ${current.singular}`}
          title={`Add ${current.singular}`}
          style={{
            minHeight: "2rem",
            padding: "0.35rem 0.65rem",
            fontSize: "0.68rem",
            gap: "0.3rem",
            marginLeft: "auto",
            alignSelf: "flex-end",
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={13} />
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {items.map((item) => (
              <Link
                href={`/admin/content/${item.contentType}/${item.slug}`}
                key={`${item.contentType}-${item.slug}`}
                style={{
                  display: "block",
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  borderRadius: "0.8rem",
                  background: "var(--surface)",
                  boxShadow: "0 0.45rem 1.25rem var(--shadow)",
                  transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden", background: "var(--surface-muted)" }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--muted)" }}
                    >
                      <Icon size={28} />
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: "0.65rem",
                      left: "0.65rem",
                      padding: "0.25rem 0.45rem",
                      borderRadius: "999px",
                      background: "color-mix(in srgb, var(--surface) 90%, transparent)",
                      color: "var(--foreground)",
                      fontSize: "0.64rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {statusLabel(item)}
                  </span>
                </div>

                <div style={{ padding: "0.9rem 0.95rem 1rem" }}>
                  <p className="eyebrow" style={{ marginBottom: "0.45rem", fontSize: "0.62rem" }}>
                    {item.category ?? current.singular}
                  </p>
                  <h3 style={{ marginBottom: "0.55rem", fontSize: "1.2rem", lineHeight: 1.05 }}>
                    {item.title}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem 0.8rem", color: "var(--muted)", fontSize: "0.72rem" }}>
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
              style={{ minHeight: "2.5rem", padding: "0.55rem 0.9rem", fontSize: "0.76rem" }}
            >
              <Plus size={16} />
              Add {current.singular}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
