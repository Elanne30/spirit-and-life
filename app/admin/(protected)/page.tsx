import Link from "next/link";
import { ArrowRight, FileText, Mail, Send, Users } from "lucide-react";
import { getNewsletterSubscriberSummary } from "@/app/lib/newsletter";
import { getPushSubscriberSummary } from "@/app/lib/push";

export default async function AdminDashboardPage() {
  const [newsletterSummary, pushSummary] = await Promise.all([
    getNewsletterSubscriberSummary(),
    getPushSubscriberSummary(),
  ]);

  const cards = [
    { title: "Content", description: "Manage reflections, journals, and books.", icon: FileText, href: "/admin/content", action: "Open content planning", detail: "File-based content and drafts" },
    { title: "Newsletter", description: "Manage email campaigns and subscribers.", icon: Mail, href: "/admin/newsletter", action: "Manage newsletter", detail: `${newsletterSummary.subscribed} active, ${newsletterSummary.pending} pending` },
    { title: "Push notifications", description: "Send updates to your push audience.", icon: Send, href: "/admin/notifications", action: "Send push update", detail: `${pushSummary.active} active, ${pushSummary.inactive} inactive` },
    { title: "Subscribers", description: "View email and push audiences.", icon: Users, href: "/admin/subscribers", action: "View subscriber summary", detail: `${newsletterSummary.subscribed} email, ${pushSummary.active} push` },
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-page-introduction">
        <div>
          <h2>Welcome back</h2>
          <p>Here&apos;s what&apos;s happening with Spirit &amp; Life.</p>
        </div>
        <span className="admin-date">Admin overview</span>
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
            <div className="admin-card-detail">{card.detail}</div>
            <Link className="admin-card-link" href={card.href}>{card.action}<ArrowRight aria-hidden="true" size={15} /></Link>
          </article>;
        })}
      </div>
    </section>
  );
}
