import Link from "next/link";
import { DraftForm } from "@/app/admin/(protected)/content/draft-form";
import { listAdminContentItems, type AdminContentItem } from "@/app/admin/(protected)/content/admin-content";
import type { DraftContentType } from "@/app/lib/content-drafts";

const sections: Array<{ contentType: DraftContentType; label: string }> = [
  { contentType: "reflection", label: "Reflections" },
  { contentType: "journal", label: "Journals" },
  { contentType: "book", label: "Books" },
];

function statusLabel(item: AdminContentItem) {
  if (item.status === "published") {
    return item.isStaticSource && !item.hasDraft ? "Published (static)" : "Published";
  }

  if (item.status === "draft") {
    return item.isStaticSource ? "Draft (unpublished changes)" : "Draft";
  }

  return "Published (static)";
}

export default async function AdminContentPage() {
  const [reflectionItems, journalItems, bookItems] = await Promise.all(
    sections.map((section) => listAdminContentItems(section.contentType)),
  );

  const itemsByType: Record<DraftContentType, AdminContentItem[]> = {
    reflection: reflectionItems,
    journal: journalItems,
    book: bookItems,
  };

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <h2>Content management</h2>
        <p>Browse every Reflection, Journal, and Book on Spirit &amp; Life — including existing static content and database drafts — and open one to preview or edit it.</p>
      </article>

      {sections.map((section) => (
        <article className="admin-card" key={section.contentType}>
          <h2>{section.label}</h2>
          {itemsByType[section.contentType].length ? (
            <ul className="admin-list">
              {itemsByType[section.contentType].map((item) => (
                <li key={`${item.contentType}-${item.slug}`}>
                  <strong>{item.title}</strong>
                  {" - "}
                  <span>{statusLabel(item)}</span>
                  {item.category ? <> - <span>{item.category}</span></> : null}
                  {" "}
                  <Link href={`/admin/content/${item.contentType}/${item.slug}`}>Open</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="quiet-note">Nothing here yet.</p>
          )}
        </article>
      ))}

      <article className="admin-card">
        <h2>Create new draft</h2>
        <p>Start a brand-new piece of content that does not yet exist on the public site.</p>
        <DraftForm />
      </article>
    </section>
  );
}
