import { PushBroadcastForm } from "@/app/admin/(protected)/notifications/push-broadcast-form";
import { getPushSubscriberSummary } from "@/app/lib/push";
import { Bell, Send, Users } from "lucide-react";

export default async function AdminNotificationsPage() {
  const summary = await getPushSubscriberSummary();

  return (
    <section className="admin-management-page">
      <div className="admin-management-heading"><div><h2>Push notifications</h2><p>Send updates and manage push subscribers.</p></div><span className="admin-date"><Users size={16} />{summary.active} active subscriptions</span></div>
      <article className="admin-card admin-management-card">
        <div className="admin-card-heading"><span className="admin-icon"><Bell size={19} /></span><h3>Push audience overview</h3></div>
        <div className="admin-stat-list"><span><strong>{summary.total}</strong><small>Total subscriptions</small></span><span><strong>{summary.active}</strong><small>Active</small></span><span><strong>{summary.inactive}</strong><small>Inactive</small></span></div>
      </article>

      <article className="admin-card admin-management-card">
        <div className="admin-card-heading"><span className="admin-icon"><Send size={19} /></span><h3>Compose push broadcast</h3></div>
        <p>Create a short message, preview it, confirm, and send to active push subscribers.</p>
        <PushBroadcastForm activeRecipientCount={summary.active} />
      </article>
    </section>
  );
}
