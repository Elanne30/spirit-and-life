import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CopyPlus, Mail } from "lucide-react";
import { getNewsletterBroadcast } from "@/app/lib/newsletter";

export default async function NewsletterBroadcastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const broadcast = await getNewsletterBroadcast(id);
  if (!broadcast) notFound();

  return (
    <section className="admin-management-page">
      <div className="admin-management-heading"><div><h2>{broadcast.subject}</h2><p>Broadcast history</p></div><div className="admin-library-actions"><Link className="admin-outline-link" href="/admin/newsletter"><ArrowLeft size={14} />Back to newsletter</Link><Link className="admin-outline-link" href={`/admin/newsletter?copy=${broadcast.id}`}><CopyPlus size={14} />Use as new draft</Link></div></div>
      <article className="admin-card admin-management-card"><div className="admin-card-heading"><span className="admin-icon"><Mail size={19} /></span><h3>Delivery summary</h3></div><div className="admin-stat-list"><span><strong>{broadcast.recipient_count}</strong><small>Selected recipients</small></span><span><strong>{broadcast.successful_recipient_count ?? 0}</strong><small>Delivered</small></span><span><strong>{broadcast.failed_recipient_count ?? 0}</strong><small>Failed</small></span><span><strong>{broadcast.status}</strong><small>Status</small></span></div><p className="quiet-note">{new Date(broadcast.sent_at ?? broadcast.created_at).toLocaleString()}</p>{broadcast.error_message ? <p className="form-error">{broadcast.error_message}</p> : null}</article>
      <article className="admin-card admin-preview"><h3>Message</h3>{broadcast.body?.split(/\n\s*\n/g).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>
      <article className="admin-card admin-subscriber-table-card"><div className="admin-panel-heading"><div><h3>Recipient delivery</h3><p>Stored delivery results for this broadcast.</p></div></div>{broadcast.recipients.length ? <div className="admin-subscriber-table" role="table"><div role="row" className="admin-delivery-row admin-subscriber-heading"><span>Email</span><span>Subscriber ID</span><span>Status</span></div>{broadcast.recipients.map((recipient) => <div role="row" className="admin-delivery-row" key={recipient.id}><span title={recipient.email}>{recipient.email}</span><span title={recipient.subscriber_id ?? ""}>{recipient.subscriber_id ?? "—"}</span><span>{recipient.delivery_status}</span></div>)}</div> : <p className="quiet-note">Individual recipient records were not stored for this earlier broadcast.</p>}</article>
    </section>
  );
}