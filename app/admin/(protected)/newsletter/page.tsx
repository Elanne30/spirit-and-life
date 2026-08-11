import { NewsletterBroadcastForm } from "@/app/admin/(protected)/newsletter/newsletter-broadcast-form";
import { getNewsletterSubscriberSummary, listRecentNewsletterBroadcasts } from "@/app/lib/newsletter";

export default async function AdminNewsletterPage() {
  const [summary, broadcasts] = await Promise.all([
    getNewsletterSubscriberSummary(),
    listRecentNewsletterBroadcasts(8),
  ]);

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <h2>Newsletter</h2>
        <p>Total subscribers: {summary.total}</p>
        <p>Active subscribers: {summary.subscribed}</p>
        <p>Pending subscribers: {summary.pending}</p>
      </article>

      <article className="admin-card">
        <h2>Compose email broadcast</h2>
        <p>Compose, preview, confirm, and send one message to active email subscribers.</p>
        <NewsletterBroadcastForm activeRecipientCount={summary.subscribed} />
      </article>

      <article className="admin-card">
        <h2>Recent broadcasts</h2>
        {broadcasts.length ? (
          <ul className="admin-list">
            {broadcasts.map((item) => (
              <li key={item.id}>
                <strong>{item.subject}</strong> - {item.status} - recipients {item.recipient_count}
              </li>
            ))}
          </ul>
        ) : (
          <p className="quiet-note">No broadcasts recorded yet.</p>
        )}
      </article>
    </section>
  );
}
