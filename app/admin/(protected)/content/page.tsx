import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, FilePenLine, FileText } from "lucide-react";
import { listArticleDrafts } from "@/app/lib/content-drafts";
import { listAdminContentItems, type AdminContentItem } from "@/app/admin/(protected)/content/admin-content";
import type { DraftContentType } from "@/app/lib/content-drafts";

const sections: Array<{ contentType: DraftContentType; label: string }> = [
  { contentType: "reflection", label: "Reflections" },
  { contentType: "journal", label: "Journals" },
  { contentType: "book", label: "Books" },
];

function statusLabel(item: AdminContentItem) {
  if (item.status === "published") return item.isStaticSource && !item.hasDraft ? "Published (static)" : item.hasUnpublishedChanges ? "Published (unpublished changes)" : "Published";
  if (item.status === "draft") return item.isStaticSource ? "Draft (unpublished changes)" : "Draft";
  return "Published (static)";
}

type ContentFilter = "reflection" | "journal" | "book" | "draft";
function filterTitle(filter: ContentFilter | undefined) { if (filter === "reflection") return "Reflection"; if (filter === "journal") return "Journal"; if (filter === "book") return "Book"; return "Draft"; }
function sortRecentItems(items: AdminContentItem[]) { return [...items].sort((left, right) => (Date.parse(right.updatedAt ?? right.date ?? "") || 0) - (Date.parse(left.updatedAt ?? left.date ?? "") || 0)); }

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [reflectionItems, journalItems, bookItems, articleItems] = await Promise.all([...sections.map((section) => listAdminContentItems(section.contentType)), listArticleDrafts()]);
  const itemsByType: Record<DraftContentType, AdminContentItem[]> = { reflection: reflectionItems, journal: journalItems, book: bookItems };
  const publishedCount = (items: AdminContentItem[]) => items.filter((item) => item.status !== "draft").length;
  const draftCount = Object.values(itemsByType).flat().filter((item) => item.status === "draft").length + articleItems.filter((item) => item.status === "draft").length;
  const requestedFilter = (await searchParams).type;
  const filter: ContentFilter | undefined = requestedFilter === "reflection" || requestedFilter === "journal" || requestedFilter === "book" || requestedFilter === "draft" ? requestedFilter : undefined;
  const visibleSections = sections.filter((section) => !filter || filter === "draft" || filter === section.contentType);
  const visibleItemsByType = Object.fromEntries(sections.map((section) => [section.contentType, sortRecentItems(itemsByType[section.contentType]).filter((item) => !filter || filter === section.contentType || (filter === "draft" && item.status === "draft"))])) as Record<DraftContentType, AdminContentItem[]>;
  const overview = [
    { type: "article", title: "Articles", description: "Manage written articles", icon: FilePenLine, count: articleItems.filter((item) => item.status === "published").length, href: "/admin/content/article" },
    { type: "reflection" as const, title: "Reflections", description: "Manage reflections and devotionals", icon: FilePenLine, count: publishedCount(reflectionItems), href: "/admin/content/reflection" },
    { type: "journal" as const, title: "Journals", description: "Manage journal entries", icon: FileText, count: publishedCount(journalItems), href: "/admin/content/journal" },
    { type: "book" as const, title: "Books", description: "Manage book summaries", icon: BookOpen, count: publishedCount(bookItems), href: "/admin/content/book" },
    { type: "draft" as const, title: "Drafts", description: "Continue editing drafts", icon: FilePenLine, count: draftCount, href: "/admin/content?type=draft" },
  ];
  const libraryItems = filter && filter !== "draft" ? visibleItemsByType[filter] : [];
  if (filter && filter !== "draft") {
    const libraryType = filter as "reflection" | "journal" | "book";
    const libraryLabel = { reflection: "Reflections", journal: "Journals", book: "Books" }[libraryType];
    return <section className="admin-library-page"><div className="admin-library-heading"><div><p className="eyebrow">Content library</p><h2>{libraryLabel}</h2><p>Manage and edit all {libraryType}s in Spirit &amp; Life.</p></div><div className="admin-library-actions"><Link className="admin-outline-link" href="/admin">Back to dashboard <ArrowRight size={14} /></Link><Link className="admin-outline-link" href="/admin/content">Back to content <ArrowRight size={14} /></Link></div></div><div className="admin-library-grid">{libraryItems.map((item) => <Link className="admin-library-card" href={`/admin/content/${item.contentType}/${item.slug}`} key={`${item.contentType}-${item.slug}`}><div className="admin-library-image">{item.image ? <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 25vw" /> : <span className="admin-icon"><BookOpen size={22} /></span>}</div><div className="admin-library-card-body"><div className="admin-library-card-title"><h3>{item.title}</h3><span className={`admin-status admin-status-${item.status}`}>{statusLabel(item)}</span></div><p>{item.category ?? "Spirit & Life content"}</p><div className="admin-library-meta"><span>{item.date ?? "No date"}</span>{item.readingTime ? <span>{item.readingTime}</span> : null}</div></div></Link>)}</div>{!libraryItems.length ? <p className="quiet-note">Nothing here yet.</p> : null}</section>;
  }
  return <section className="admin-content-page"><article className="admin-card admin-page-intro-card"><h2>{filter ? `${filterTitle(filter)} Content` : "Content Management Overview"}</h2><p>{filter ? "Browse every matching record across Spirit &amp; Life." : "Browse and manage all content across Spirit &amp; Life."}</p><div className="admin-content-overview-grid">{overview.map((item) => { const Icon = item.icon; return <article className="admin-content-overview-card" key={item.title}><span className="admin-icon"><Icon size={19} /></span><h3>{item.title}</h3><p>{item.description}</p><strong>{item.count}</strong><small>{item.type === "draft" ? "Drafts" : "Published"}</small><Link href={item.href}>View all <ArrowRight size={14} /></Link></article>; })}</div></article><article className="admin-card admin-recent-content"><div className="admin-panel-heading"><h2>Recent Content</h2><Link className="admin-outline-link" href="/admin/content">View all content <ArrowRight size={14} /></Link></div><div className="admin-recent-columns">{visibleSections.map((section) => <div key={section.contentType}><h3>{filter ? section.label : `Recent ${section.label}`}</h3><ul className="admin-content-list">{visibleItemsByType[section.contentType].map((item) => <li key={`${item.contentType}-${item.slug}`}><Link href={`/admin/content/${item.contentType}/${item.slug}`}><strong>{item.title}</strong><small>{item.category ?? statusLabel(item)}{item.date ? ` · ${item.date}` : ""}</small></Link></li>)}</ul>{!visibleItemsByType[section.contentType].length ? <p className="quiet-note">Nothing here yet.</p> : null}</div>)}</div></article></section>;
}
