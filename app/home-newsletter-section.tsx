"use client";

import { useActionState, useState } from "react";
import { Button } from "@/app/components/button";
import { subscribeNewsletterAction, type NewsletterFormState } from "@/app/actions/newsletter";

export function HomeNewsletterSection() {
  const [newsletterState, formAction, isPending] = useActionState(subscribeNewsletterAction, { status: "idle", message: "" } satisfies NewsletterFormState);
  const [pushMessage, setPushMessage] = useState("");

  async function handleEnablePush() {
    setPushMessage("");

    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setPushMessage("This browser does not support web push notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setPushMessage("Push notifications were not enabled.");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setPushMessage("Push notifications are not configured yet.");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    setPushMessage("Push notifications are enabled.");
  }

  function urlBase64ToUint8Array(value: string) {
    const padding = "=".repeat((4 - (value.length % 4)) % 4);
    const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = window.atob(base64);
    const output = new Uint8Array(raw.length);

    for (let index = 0; index < raw.length; index += 1) {
      output[index] = raw.charCodeAt(index);
    }

    return output;
  }

  return (
    <section id="newsletter" className="newsletter-section page-container" aria-labelledby="newsletter-title">
      <div>
        <p className="eyebrow">Newsletter</p>
        <h2 id="newsletter-title">Stay Connected</h2>
        <p>Receive new reflections, biblical studies, and updates from Spirit &amp; Life.</p>
      </div>
      <form className="newsletter-form" action={formAction}>
        <label htmlFor="email">Email address</label>
        <div className="newsletter-field">
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
          <Button type="submit">{isPending ? "Subscribing..." : "Subscribe"}</Button>
        </div>
        {newsletterState.message ? <p className="form-note" role="status">{newsletterState.message}</p> : null}
        <Button type="button" variant="secondary" onClick={handleEnablePush}>Enable web push notifications</Button>
        {pushMessage ? <p className="form-note" role="status">{pushMessage}</p> : null}
      </form>
    </section>
  );
}
