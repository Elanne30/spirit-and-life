"use client";

import { useActionState, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/app/components/button";
import { subscribeNewsletterAction, type NewsletterFormState } from "@/app/actions/newsletter";

export function HomeNewsletterSection() {
  const [newsletterState, formAction, isPending] = useActionState(subscribeNewsletterAction, { status: "idle", message: "" } satisfies NewsletterFormState);
  const [pushState, setPushState] = useState<{ status: "idle" | "success" | "error"; message: string }>({ status: "idle", message: "" });
  const [isEnablingPush, setIsEnablingPush] = useState(false);

  async function handleEnablePush() {
    setPushState({ status: "idle", message: "" });

    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setPushState({ status: "error", message: "This browser does not support push notifications." });
      return;
    }

    if (Notification.permission === "denied") {
      setPushState({ status: "error", message: "Notifications are blocked in your browser settings." });
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setPushState({ status: "error", message: "Push notifications are not configured yet." });
      return;
    }

    setIsEnablingPush(true);

    try {
      const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      if (permission !== "granted") {
        setPushState({ status: "error", message: "Notifications were not enabled." });
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      let subscription = await registration.pushManager.getSubscription();
      const alreadySubscribed = Boolean(subscription);

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      const result = await response.json() as { status?: string; message?: string };

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message ?? "Push subscription could not be saved.");
      }

      setPushState({ status: "success", message: alreadySubscribed ? "Notifications are already enabled on this device." : "Notifications are enabled on this device." });
    } catch (error) {
      setPushState({ status: "error", message: error instanceof Error ? error.message : "Push notifications could not be enabled." });
    } finally {
      setIsEnablingPush(false);
    }
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
          <button className="push-enable-button" type="button" onClick={handleEnablePush} disabled={isEnablingPush} aria-label="Enable notifications" title="Enable notifications">
            <Bell aria-hidden="true" size={18} />
          </button>
        </div>
        {newsletterState.message ? <p className={newsletterState.status === "error" ? "form-error" : "form-note"} role={newsletterState.status === "error" ? "alert" : "status"}>{newsletterState.message}</p> : null}
        {pushState.message ? <p className={pushState.status === "error" ? "form-error" : "form-note"} role={pushState.status === "error" ? "alert" : "status"}>{pushState.message}</p> : null}
      </form>
    </section>
  );
}
