"use client";

import { useActionState, useMemo, useState } from "react";
import { initialAdminActionState, sendAdminNewsletterBroadcastAction } from "@/app/admin/(protected)/actions/communications";

export function NewsletterBroadcastForm({ activeRecipientCount }: { activeRecipientCount: number }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ctaHref, setCtaHref] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [state, formAction, isPending] = useActionState(sendAdminNewsletterBroadcastAction, initialAdminActionState);

  const previewParagraphs = useMemo(
    () => message.split(/\n\s*\n/g).map((paragraph) => paragraph.trim()).filter(Boolean),
    [message],
  );

  return (
    <div className="admin-stack">
      <form className="admin-form" action={formAction}>
        <label htmlFor="newsletter-subject">Subject</label>
        <input id="newsletter-subject" name="subject" type="text" value={subject} onChange={(event) => setSubject(event.target.value)} required />

        <label htmlFor="newsletter-message">Message</label>
        <textarea id="newsletter-message" name="message" value={message} onChange={(event) => setMessage(event.target.value)} rows={8} required />

        <label htmlFor="newsletter-cta">Optional website link</label>
        <input id="newsletter-cta" name="ctaHref" type="url" placeholder="https://example.com" value={ctaHref} onChange={(event) => setCtaHref(event.target.value)} />

        <p className="quiet-note">Active recipients: {activeRecipientCount}</p>

        <label className="admin-checkbox" htmlFor="newsletter-confirm">
          <input id="newsletter-confirm" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
          I confirm sending this email broadcast.
        </label>
        <input name="confirmSend" type="hidden" value={confirmed ? "yes" : "no"} />

        <button className="button button-primary" type="submit" disabled={isPending}>{isPending ? "Sending..." : "Send broadcast"}</button>
        {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"}>{state.message}</p> : null}
      </form>

      <section className="admin-preview" aria-label="Newsletter preview">
        <h3>Email preview</h3>
        <p className="admin-preview-subject">{subject || "Subject preview"}</p>
        {previewParagraphs.length ? previewParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p className="quiet-note">Write your message to preview it here.</p>}
        {ctaHref ? <p className="quiet-note">Link: {ctaHref}</p> : null}
      </section>
    </div>
  );
}
