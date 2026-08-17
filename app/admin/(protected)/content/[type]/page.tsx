import Link from "next/link";
import { CalendarDays, Clock3, Eye, Plus, Search } from "lucide-react";
import { listAdminContentItems, type AdminContentItem } from "@/app/admin/(protected)/content/admin-content";
import { ContentMoreActions } from "@/app/admin/(protected)/content/content-more-actions";
import type { DraftContentType } from "@/app/lib/content-drafts";
import styles from "../admin-library-reference.module.css";

const config: Record<DraftContentType, {
  label: string;
  singular: string;
  description: string;
}> = {
  reflection: {
    label: "Reflections",
    singular: "Reflection",
    description: "Write and manage reflections on faith, Scripture, life, and eternal things.",
  },
  journal: {
    label: "Journals",
    singular: "Journal",
    description: "Write and manage personal journal entries and thoughtful observations.",
  },
  book: {
    label: "Books",
    singular: "Book",
    description: "Manage your books, previews, and reading records.",
  },
};

function statusLabel(item: AdminContentItem) {
  if (item.status === "published" || item.status === "static") return "Published";
  return "Draft";
}

function statusClass(item: AdminContentItem) {
  return item.status === "published" || item.status === "static" ? styles.statusPublished : styles.statusDraft;
}

function imageFor(item: AdminContentItem) {
  return item.image ?? "";
}

export default async function ContentTypeWorkspace({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "reflection" && type !== "journal" && type !== "book") return null;

  const contentType = type as DraftContentType;
  const current = config[contentType];
  const items = await listAdminContentItems(contentType);
  const publishedCount = items.filter((item) => item.status === "published" || item.status === "static").length;
  const draftCount = items.filter((item) => item.status === "draft").length;

  return (
    <section className={`${styles.library} admin-library-page`}>
      <div className={styles.heading}>
        <h1>{current.label}</h1>
        <p>{current.description}</p>
      </div>

      <div className={styles.toolbar}>
        <nav className={styles.tabs} aria-label={`${current.label} filters`}>
          <span className={`${styles.tab} ${styles.tabActive}`}>All ({items.length})</span>
          <span className={styles.tab}>Published ({publishedCount})</span>
          <span className={styles.tab}>Drafts ({draftCount})</span>
          <span className={styles.tab}>Archived (0)</span>
        </nav>

        <label className={styles.search}>
          <Search size={15} aria-hidden="true" />
          <input aria-label={`Search ${current.label.toLowerCase()}`} placeholder={`Search ${current.label.toLowerCase()}...`} readOnly />
        </label>

        <Link
          className={`button button-primary ${styles.addButton}`}
          href={`/admin/content/${contentType}/new`}
          aria-label={`Add ${current.singular}`}
        >
          <Plus size={15} />
          Add {current.singular}
        </Link>
      </div>

      {items.length ? (
        <div className={styles.grid}>
          {items.map((item) => {
            const image = imageFor(item);
            const isBook = contentType === "book";
            return (
              <article className={styles.card} key={`${item.contentType}-${item.slug}`}>
                <Link
                  className={`${styles.imageWrap} ${isBook ? styles.bookImageWrap : ""}`}
                  href={`/admin/content/${item.contentType}/${item.slug}`}
                  aria-label={`Open ${item.title}`}
                >
                  {image ? (
                    <img
                      className={`${styles.image} ${isBook ? styles.bookImage : ""}`}
                      src={image}
                      alt=""
                      loading="lazy"
                    />
                  ) : null}
                  <span className={`${styles.status} ${statusClass(item)}`}>
                    {statusLabel(item)}
                  </span>
                </Link>

                <div className={styles.body}>
                  <p className={styles.category}>{item.category ?? current.singular}</p>
                  <h2 className={styles.title}>{item.title}</h2>
                  <div className={styles.meta}>
                    {item.date ? <span><CalendarDays size={12} />{item.date}</span> : null}
                    {item.readingTime ? <span><Clock3 size={12} />{item.readingTime}</span> : null}
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link className={styles.action} href={`/admin/content/${item.contentType}/${item.slug}?view=edit`}>
                    Edit
                  </Link>
                  <Link className={styles.action} href={`/admin/content/${item.contentType}/${item.slug}`} aria-label={`Preview ${item.title}`} title="Preview">
                    <Eye size={15} />
                  </Link>
                  <ContentMoreActions
                    contentType={item.contentType}
                    slug={item.slug}
                    title={item.title}
                    status={item.status}
                    draftId={item.draftId}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          No {current.label.toLowerCase()} yet. Add your first {current.singular.toLowerCase()} to begin.
        </div>
      )}
    </section>
  );
}
