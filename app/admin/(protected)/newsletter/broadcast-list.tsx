"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteNewsletterBroadcastAction } from "@/app/admin/(protected)/actions/communications";
import type { NewsletterBroadcastRecord } from "@/app/lib/newsletter";

const initialState = { status: "idle" as const, message: "" };

export function BroadcastList({ broadcasts }: { broadcasts: NewsletterBroadcastRecord[] }) {
  const [state, formAction, isPending] = useActionState(deleteNewsletterBroadcastAction, initialState);

  if (!broadcasts.length) return <p className="quiet-note">No broadcasts recorded yet.</p>;

  return (
    <div className="admin-broadcast-stack">
      {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"} role="status">{state.message}</p> : null}
      <div className="admin-broadcast-grid">
        {broadcasts.map((broadcast) => (
          <article className="admin-broadcast-card" key={broadcast.id}>
            <Link href={`/admin/newsletter/${broadcast.id}`} className="admin-broadcast-link"><strong>{broadcast.subject}</strong><span>{broadcast.status}</span><small>{new Date(broadcast.sent_at ?? broadcast.created_at).toLocaleString()}</small><small>{broadcast.successful_recipient_count ?? broadcast.recipient_count} delivered{broadcast.failed_recipient_count ? ` · ${broadcast.failed_recipient_count} failed` : ""}</small></Link>
            <form action={formAction} onSubmit={(event) => { if (!window.confirm(`Delete the broadcast history for “${broadcast.subject}”? This will not delete subscribers or resend anything.`)) event.preventDefault(); }}><input type="hidden" name="broadcastId" value={broadcast.id} /><button className="admin-icon-button admin-icon-button-danger" type="submit" disabled={isPending} aria-label={`Delete ${broadcast.subject}`} title="Delete broadcast history"><Trash2 size={15} /></button></form>
          </article>
        ))}
      </div>
    </div>
  );
}