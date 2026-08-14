import { NewsletterBroadcastForm } from "@/app/admin/(protected)/newsletter/newsletter-broadcast-form";
import { BroadcastList } from "@/app/admin/(protected)/newsletter/broadcast-list";
import { countNewsletterBroadcasts, getNewsletterBroadcast, getNewsletterSubscriberSummary, listNewsletterSubscribers, listRecentNewsletterBroadcasts } from "@/app/lib/newsletter";
import { Mail, Send, Users } from "lucide-react";

export default async function AdminNewsletterPage({ searchParams }: { searchParams: Promise<{ copy?: string }> }) {
  const copyId = (await searchParams).copy;
  const [summary, broadcasts, subscribers, broadcastCount, sourceBroadcast] = await Promise.all([
    getNewsletterSubscriberSummary(),
    listRecentNewsletterBroadcasts(50),
    listNewsletterSubscribers(),
    countNewsletterBroadcasts(),
    copyId ? getNewsletterBroadcast(copyId) : Promise.resolve(null),
  ]);

  return (
    <section className="admin-management-page">
      <div className="admin-management-heading"><div><h2>Newsletter</h2><p>Manage email campaigns and subscribers.</p></div><span className="admin-date"><Users size={16} />{summary.subscribed} active subscribers</span></div>
      <article className="admin-card admin-management-card">
        <div className="admin-card-heading"><span className="admin-icon"><Mail size={19} /></span><h3>Audience overview</h3></div>
        <div className="admin-stat-list"><span><strong>{summary.total}</strong><small>Total subscribers</small></span><span><strong>{summary.subscribed}</strong><small>Active</small></span><span><strong>{summary.pending}</strong><small>Pending</small></span><span><strong>{summary.unsubscribed}</strong><small>Unsubscribed</small></span><span><strong>{broadcastCount}</strong><small>Broadcasts</small></span></div>
      </article>

      <article className="admin-card admin-management-card">
        <div className="admin-card-heading"><span className="admin-icon"><Send size={19} /></span><h3>Compose email broadcast</h3></div>
        <p>Compose, preview, confirm, and send one message to active email subscribers.</p>
        <NewsletterBroadcastForm activeRecipientCount={summary.subscribed} subscribers={subscribers} initialSubject={sourceBroadcast?.subject} initialMessage={sourceBroadcast?.body} />
      </article>

      <article className="admin-card admin-management-card">
        <div className="admin-card-heading"><span className="admin-icon"><Mail size={19} /></span><h3>Recent broadcasts</h3></div>
        <BroadcastList broadcasts={broadcasts} />
      </article>
    </section>
  );
}
