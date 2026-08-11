import { PushBroadcastForm } from "@/app/admin/(protected)/notifications/push-broadcast-form";
import { getPushSubscriberSummary } from "@/app/lib/push";

export default async function AdminNotificationsPage() {
  const summary = await getPushSubscriberSummary();

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <h2>Push notifications</h2>
        <p>Active subscriptions: {summary.active}</p>
        <p>Inactive subscriptions: {summary.inactive}</p>
      </article>

      <article className="admin-card">
        <h2>Compose push broadcast</h2>
        <p>Create a short message, preview it, confirm, and send to active push subscribers.</p>
        <PushBroadcastForm activeRecipientCount={summary.active} />
      </article>
    </section>
  );
}
