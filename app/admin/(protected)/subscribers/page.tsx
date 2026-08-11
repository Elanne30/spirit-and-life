import { getNewsletterSubscriberSummary } from "@/app/lib/newsletter";
import { getPushSubscriberSummary } from "@/app/lib/push";

export default async function AdminSubscribersPage() {
  const [newsletterSummary, pushSummary] = await Promise.all([
    getNewsletterSubscriberSummary(),
    getPushSubscriberSummary(),
  ]);

  return (
    <section className="admin-grid">
      <article className="admin-card">
        <h2>Email subscribers</h2>
        <p>Total: {newsletterSummary.total}</p>
        <p>Active: {newsletterSummary.subscribed}</p>
        <p>Pending: {newsletterSummary.pending}</p>
        <p>Unsubscribed: {newsletterSummary.unsubscribed}</p>
      </article>

      <article className="admin-card">
        <h2>Push subscribers</h2>
        <p>Total: {pushSummary.total}</p>
        <p>Active: {pushSummary.active}</p>
        <p>Inactive: {pushSummary.inactive}</p>
      </article>
    </section>
  );
}
