import Link from "next/link";
import { ArrowRight, BookOpen, FilePenLine, FileText } from "lucide-react";
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
  const publishedCount = (items: AdminContentItem[]) => items.filter((item) => item.status !== "draft").length;
  const draftCount = Object.values(itemsByType).flat().filter((item) => item.status === "draft").length;
  const overview = [
    { type: "reflection" as const, title: "Reflections", description: "Manage reflections and devotionals", icon: FilePenLine, count: publishedCount(reflectionItems), href: "/admin/content/reflection" },
    { type: "journal" as const, title: "Journals", description: "Manage journal articles", icon: FileText, count: publishedCount(journalItems), href: "/admin/content/journal" },
    { type: "book" as const, title: "Books", description: "Manage book summaries", icon: BookOpen, count: publishedCount(bookItems), href: "/admin/content/book" },
    { type: "draft" as const, title: "Drafts", description: "Continue editing drafts", icon: FilePenLine, count: draftCount, href: "/admin/content" },
  ];

  return (
    <section className="admin-content-page">
      <article className="admin-card admin-page-intro-card">
        <h2>Content Management Overview</h2>
        <p>Browse and manage all content across Spirit &amp; Life.</p>
        <div className="admin-content-overview-grid">
          {overview.map((item) => { const Icon = item.icon; return <article className="admin-content-overview-card" key={item.title}><span className="admin-icon"><Icon size={19} /></span><h3>{item.title}</h3><p>{item.description}</p><strong>{item.count}</strong><small>{item.type === "draft" ? "Drafts" : "Published"}</small><Link href={item.href}>View all <ArrowRight size={14} /></Link></article>; })}
        </div>
      </article>

      <article className="admin-card admin-recent-content">
        <div className="admin-panel-heading"><h2>Recent Content</h2><Link className="admin-outline-link" href="/admin/content">View all content <ArrowRight size={14} /></Link></div>
        <div className="admin-recent-columns">
          {sections.map((section) => <div key={section.contentType}><h3>Recent {section.label}</h3><ul className="admin-content-list">{itemsByType[section.contentType].slice(0, 4).map((item) => <li key={`${item.contentType}-${item.slug}`}><Link href={`/admin/content/${item.contentType}/${item.slug}`}><strong>{item.title}</strong><small>{item.category ?? statusLabel(item)}{item.date ? ` · ${item.date}` : ""}</small></Link></li>)}</ul></div>)}
        </div>
      </article>

      <article className="admin-card admin-draft-card">
        <h2>Create New Draft</h2>
        <p>Start a new piece of content that does not yet exist on the public site.</p>
        <DraftForm />
      </article>
    </section>
  );
}
