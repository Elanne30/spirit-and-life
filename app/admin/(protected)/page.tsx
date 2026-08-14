import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, CalendarDays, FileText, Mail, PenLine, Send, Users } from "lucide-react";
import { listAdminContentItems } from "@/app/admin/(protected)/content/admin-content";
import type { DraftContentType } from "@/app/lib/content-drafts";
import { getNewsletterSubscriberSummary } from "@/app/lib/newsletter";
import { getPushSubscriberSummary } from "@/app/lib/push";

export default async function AdminDashboardPage() {
  const [newsletterSummary, pushSummary, reflectionItems, journalItems, bookItems] = await Promise.all([
    getNewsletterSubscriberSummary(),
    getPushSubscriberSummary(),
    listAdminContentItems("reflection"),
    listAdminContentItems("journal"),
    listAdminContentItems("book"),
  ]);
  const contentGroups: Array<{ type: DraftContentType; label: string; description: string; icon: typeof FileText; items: Awaited<ReturnType<typeof listAdminContentItems>> }> = [
    { type: "reflection", label: "Reflections", description: "Published reflections and devotionals", icon: PenLine, items: reflectionItems },
    { type: "journal", label: "Journals", description: "Published journal articles", icon: FileText, items: journalItems },
    { type: "book", label: "Books", description: "Published book summaries", icon: BookOpen, items: bookItems },
  ];
  const publishedCount = (items: typeof reflectionItems) => items.filter((item) => item.status !== "draft").length;
  const today = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date());

  const cards = [
    { title: "Content", description: "Manage reflections, journals, and books", icon: FileText, href: "/admin/content", action: "Open content planning", detail: `${reflectionItems.length + journalItems.length + bookItems.length}`, label: "Total items" },
    { title: "Newsletter", description: "Manage email campaigns and subscribers", icon: Mail, href: "/admin/newsletter", action: "Manage newsletter", detail: `${newsletterSummary.subscribed}|${newsletterSummary.pending}`, label: "Active subscribers|Pending" },
    { title: "Push notifications", description: "Send updates and manage push subscribers", icon: Send, href: "/admin/notifications", action: "Send push update", detail: `${pushSummary.active}|${pushSummary.inactive}`, label: "Active subscribers|Inactive" },
    { title: "Subscribers", description: "View and manage all subscribers", icon: Users, href: "/admin/subscribers", action: "View subscriber summary", detail: `${newsletterSummary.subscribed}|${pushSummary.active}`, label: "Email subscribers|Push subscribers" },
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-page-introduction">
        <div>
          <h2>Welcome back</h2>
          <p>Here&apos;s what&apos;s happening with Spirit &amp; Life.</p>
        </div>
        <span className="admin-date"><CalendarDays aria-hidden="true" size={16} />{today}</span>
      </div>
      <div className="admin-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return <article className="admin-card admin-summary-card" key={card.title}>
            <div className="admin-card-heading">
              <span className="admin-icon"><Icon aria-hidden="true" size={19} strokeWidth={1.8} /></span>
              <h3>{card.title}</h3>
            </div>
            <p>{card.description}</p>
            <div className="admin-card-detail admin-card-metrics">{card.detail.split("|").map((value, index) => <span key={`${card.title}-${index}`}><strong>{value}</strong><small>{card.label.split("|")[index]}</small></span>)}</div>
            <Link className="admin-card-link" href={card.href}>{card.action}<ArrowRight aria-hidden="true" size={15} /></Link>
          </article>;
        })}
      </div>
      <div className="admin-dashboard-lower">
        <article className="admin-card admin-overview-panel">
          <div className="admin-panel-heading"><div><h3><BarChart3 aria-hidden="true" size={17} />Content Overview</h3><p>A quick look at your published content.</p></div><Link className="admin-outline-link" href="/admin/content">View all content <ArrowRight size={14} /></Link></div>
          {contentGroups.map((group) => { const Icon = group.icon; return <div className="admin-overview-row" key={group.type}><span className="admin-icon"><Icon size={16} /></span><div><strong>{group.label}</strong><small>{group.description}</small></div><b>{publishedCount(group.items)}<small>Published</small></b></div>; })}
        </article>
        <article className="admin-card admin-overview-panel">
          <div className="admin-panel-heading"><div><h3><CalendarDays aria-hidden="true" size={17} />Recent Activity</h3><p>Latest actions across your admin panel.</p></div></div>
          <div className="admin-empty-activity"><span className="admin-icon"><CalendarDays size={16} /></span><p>No activity history is available yet.</p></div>
        </article>
      </div>
    </section>
  );
}
