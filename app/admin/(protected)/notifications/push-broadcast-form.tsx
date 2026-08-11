"use client";

import { useActionState, useState } from "react";
import { initialAdminActionState, sendAdminPushBroadcastAction } from "@/app/admin/(protected)/actions/communications";

export function PushBroadcastForm({ activeRecipientCount }: { activeRecipientCount: number }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [confirmed, setConfirmed] = useState(false);
  const [state, formAction, isPending] = useActionState(sendAdminPushBroadcastAction, initialAdminActionState);

  return (
    <div className="admin-stack">
      <form className="admin-form" action={formAction}>
        <label htmlFor="push-title">Title</label>
        <input id="push-title" name="title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />

        <label htmlFor="push-body">Message</label>
        <textarea id="push-body" name="body" value={body} onChange={(event) => setBody(event.target.value)} rows={4} required />

        <label htmlFor="push-url">Optional internal URL</label>
        <input id="push-url" name="url" type="text" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="/" />

        <p className="quiet-note">Eligible push audience: {activeRecipientCount}</p>

        <label className="admin-checkbox" htmlFor="push-confirm">
          <input id="push-confirm" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
          I confirm sending this push broadcast.
        </label>
        <input name="confirmSend" type="hidden" value={confirmed ? "yes" : "no"} />

        <button className="button button-primary" type="submit" disabled={isPending}>{isPending ? "Sending..." : "Send push"}</button>
        {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"}>{state.message}</p> : null}
      </form>

      <section className="admin-preview" aria-label="Push preview">
        <h3>Push preview</h3>
        <p className="admin-preview-subject">{title || "Title preview"}</p>
        <p>{body || "Message preview"}</p>
        <p className="quiet-note">Target URL: {url || "/"}</p>
      </section>
    </div>
  );
}
