import Link from "next/link";
import { getNewsletterSubscriberSummary } from "@/app/lib/newsletter";
import { getPushSubscriberSummary } from "@/app/lib/push";
import { ArrowRight, Mail, Send, Users } from "lucide-react";

export default async function AdminSubscribersPage() {
  const [newsletterSummary, pushSummary] = await Promise.all([
    getNewsletterSubscriberSummary(),
    getPushSubscriberSummary(),
  ]);

  return (
    <section className="admin-management-page">
      <div className="admin-management-heading"><div><h2>Subscribers</h2><p>View and manage email and push audiences.</p></div><span className="admin-date"><Users size={16} />{newsletterSummary.total + pushSummary.total} total records</span></div>
      <div className="admin-grid">
        <article className="admin-card admin-management-card"><div className="admin-card-heading"><span className="admin-icon"><Mail size={19} /></span><h3>Email subscribers</h3></div><div className="admin-stat-list"><span><strong>{newsletterSummary.total}</strong><small>Total subscribers</small></span><span><strong>{newsletterSummary.subscribed}</strong><small>Active</small></span><span><strong>{newsletterSummary.pending}</strong><small>Pending</small></span><span><strong>{newsletterSummary.unsubscribed}</strong><small>Unsubscribed</small></span></div><Link className="admin-card-link" href="/admin/newsletter">Manage newsletter <ArrowRight size={15} /></Link></article>
        <article className="admin-card admin-management-card"><div className="admin-card-heading"><span className="admin-icon"><Send size={19} /></span><h3>Push subscribers</h3></div><div className="admin-stat-list"><span><strong>{pushSummary.total}</strong><small>Total subscriptions</small></span><span><strong>{pushSummary.active}</strong><small>Active</small></span><span><strong>{pushSummary.inactive}</strong><small>Inactive</small></span></div><Link className="admin-card-link" href="/admin/notifications">Manage push <ArrowRight size={15} /></Link></article>
      </div>
      <article className="admin-card admin-subscriber-table-card"><div className="admin-panel-heading"><div><h3><Users size={17} />Subscriber records</h3><p>Detailed records are available to the existing newsletter and push management workflows.</p></div></div><div className="admin-subscriber-table" role="table" aria-label="Subscriber records"><div role="row" className="admin-subscriber-row admin-subscriber-heading"><span>Subscriber ID</span><span>Email / endpoint</span><span>Status</span><span>Subscription type</span><span>Date joined</span><span>Actions</span></div><p className="admin-empty-table">The current subscriber services expose aggregate summaries here. Individual records remain managed by their existing newsletter and push workflows.</p></div></article>
    </section>
  );
}
