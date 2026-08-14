"use client";

import { useActionState, useDeferredValue, useMemo, useState } from "react";
import { sendAdminNewsletterBroadcastAction } from "@/app/admin/(protected)/actions/communications";
import type { SubscriberRecord } from "@/app/lib/newsletter";
import { getSubscriberDisplayName } from "@/app/lib/subscriber-display-name";

const initialAdminActionState = {
  status: "idle" as const,
  message: "",
};

export function NewsletterBroadcastForm({ activeRecipientCount, subscribers, initialSubject = "", initialMessage = "" }: { activeRecipientCount: number; subscribers: SubscriberRecord[]; initialSubject?: string; initialMessage?: string }) {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState(initialMessage);
  const [ctaHref, setCtaHref] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [recipientMode, setRecipientMode] = useState<"all" | "selected">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [recipientSearch, setRecipientSearch] = useState("");
  const deferredRecipientSearch = useDeferredValue(recipientSearch.trim().toLowerCase());
  const [state, formAction, isPending] = useActionState(sendAdminNewsletterBroadcastAction, initialAdminActionState);

  const previewParagraphs = useMemo(
    () => message.split(/\n\s*\n/g).map((paragraph) => paragraph.trim()).filter(Boolean),
    [message],
  );
  const activeSubscribers = subscribers.filter((subscriber) => subscriber.status === "subscribed");
  const visibleSubscribers = activeSubscribers.filter((subscriber) => !deferredRecipientSearch || [getSubscriberDisplayName(subscriber), subscriber.email, subscriber.id].some((value) => value.toLowerCase().includes(deferredRecipientSearch)));
  const recipientCount = recipientMode === "all" ? activeSubscribers.length : selectedIds.length;
  const allVisibleSelected = Boolean(visibleSubscribers.length) && visibleSubscribers.every((subscriber) => selectedIds.includes(subscriber.id));

  return (
    <div className="admin-stack">
      <form className="admin-form" action={formAction}>
        <label htmlFor="newsletter-subject">Subject</label>
        <input id="newsletter-subject" name="subject" type="text" value={subject} onChange={(event) => setSubject(event.target.value)} required />

        <label htmlFor="newsletter-message">Message</label>
        <textarea id="newsletter-message" name="message" value={message} onChange={(event) => setMessage(event.target.value)} rows={8} required />

        <label htmlFor="newsletter-cta">Optional website link</label>
        <input id="newsletter-cta" name="ctaHref" type="url" placeholder="https://example.com" value={ctaHref} onChange={(event) => setCtaHref(event.target.value)} />

        <fieldset className="admin-recipient-picker">
          <legend>Recipients</legend>
          <div className="admin-recipient-actions"><button className={`admin-tab${recipientMode === "all" ? " is-active" : ""}`} type="button" onClick={() => setRecipientMode("all")}>Send to all active subscribers</button><button className={`admin-tab${recipientMode === "selected" ? " is-active" : ""}`} type="button" onClick={() => setRecipientMode("selected")}>Send to selected</button></div>
          <label className="admin-search-control" htmlFor="newsletter-recipient-search"><span className="sr-only">Search recipients</span><input id="newsletter-recipient-search" type="search" value={recipientSearch} onChange={(event) => setRecipientSearch(event.target.value)} placeholder="Search active recipients" /></label>
          <div className="admin-recipient-toolbar"><span>{recipientMode === "all" ? activeRecipientCount : selectedIds.length} selected</span><button type="button" onClick={() => setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !visibleSubscribers.some((subscriber) => subscriber.id === id)) : Array.from(new Set([...current, ...visibleSubscribers.map((subscriber) => subscriber.id)])))}>{allVisibleSelected ? "Unselect visible" : "Select visible"}</button><button type="button" onClick={() => setSelectedIds([])}>Clear selection</button></div>
          <div className="admin-recipient-list">{visibleSubscribers.map((subscriber) => <label className="admin-recipient-row" key={subscriber.id}><input type="checkbox" name="recipientId" value={subscriber.id} checked={selectedIds.includes(subscriber.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, subscriber.id] : current.filter((id) => id !== subscriber.id))} /><span><strong>{getSubscriberDisplayName(subscriber)}</strong><small>{subscriber.email} · {subscriber.id} · {subscriber.status}</small></span></label>)}{!visibleSubscribers.length ? <p className="quiet-note">No active recipients match this search.</p> : null}</div>
          <input type="hidden" name="recipientMode" value={recipientMode} />
        </fieldset>

        <p className="quiet-note">You are about to send this newsletter to {recipientCount} subscriber{recipientCount === 1 ? "" : "s"}.</p>

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
