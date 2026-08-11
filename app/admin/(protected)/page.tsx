import Link from "next/link";
import { getNewsletterSubscriberSummary } from "@/app/lib/newsletter";
import { getPushSubscriberSummary } from "@/app/lib/push";

export default async function AdminDashboardPage() {
  const [newsletterSummary, pushSummary] = await Promise.all([
    getNewsletterSubscriberSummary(),
    getPushSubscriberSummary(),
  ]);

  return (
    <section className="admin-grid">
      <article className="admin-card">
        <h2>Content</h2>
        <p>Reflection, journal, and book content is currently file-based and preserved.</p>
        <Link className="button button-text" href="/admin/content">Open content planning</Link>
      </article>

      <article className="admin-card">
        <h2>Newsletter</h2>
        <p>{newsletterSummary.subscribed} active email subscriber{newsletterSummary.subscribed === 1 ? "" : "s"}</p>
        <p>{newsletterSummary.pending} pending, {newsletterSummary.unsubscribed} unsubscribed</p>
        <Link className="button button-text" href="/admin/newsletter">Manage newsletter</Link>
      </article>

      <article className="admin-card">
        <h2>Push notifications</h2>
        <p>{pushSummary.active} active push subscriber{pushSummary.active === 1 ? "" : "s"}</p>
        <p>{pushSummary.inactive} inactive subscriptions on record</p>
        <Link className="button button-text" href="/admin/notifications">Send push update</Link>
      </article>

      <article className="admin-card">
        <h2>Subscribers</h2>
        <p>Email and push audiences are separated and managed independently.</p>
        <Link className="button button-text" href="/admin/subscribers">View subscriber summary</Link>
      </article>
    </section>
  );
}
