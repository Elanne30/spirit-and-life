"use client";

import { useActionState } from "react";
import { submitContactFormAction, type ContactFormState } from "@/app/actions/contact";
import { siteConfig } from "@/app/content/site-config";
import { socialLinks } from "@/app/content/social";

export default function ContactPage() {
  const initialState: ContactFormState = { status: "idle", message: "" };
  const [state, formAction, isPending] = useActionState(submitContactFormAction, initialState);

  return (
    <main className="contact-main">
      <section className="page-intro page-container">
        <p className="eyebrow">Get in Touch</p>
        <h1>Contact</h1>
        <p>Have a question, a reflection to share, or a thought to discuss? I&apos;d love to hear from you.</p>
      </section>

      <section className="contact-layout">
        <form className="contact-form" action={formAction}>
          <h2>Send a message</h2>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Your name" required maxLength={160} />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="your@email.com" required maxLength={320} />
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Your message..." required maxLength={10_000} />
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <button className="button button-primary" type="submit" disabled={isPending}>{isPending ? "Sending..." : "Send Message"}</button>
          {state.status === "success" ? <p role="status">{state.message}</p> : null}
          {state.status === "error" ? <p className="form-error" role="alert">{state.message}</p> : null}
        </form>

        <div className="contact-stack">
          <article className="contact-card">
            <p className="eyebrow">Correspondence</p>
            <h2>Send a Message</h2>
            <p>Use the form to share a question, a reflection, or a thought. Every message is read, and each one is answered personally.</p>
          </article>
          <article className="contact-card">
            <p className="eyebrow">A considered reply</p>
            <h2>Response Time</h2>
            <p>Thoughtful replies take time. I aim to respond within a few days, because careful questions deserve careful answers.</p>
          </article>
          <article className="contact-card">
            <p className="eyebrow">Email</p>
            <h2>Direct correspondence</h2>
            <p>{siteConfig.contact.email ? <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> : "An email address will be published when the contact connection is configured."}</p>
          </article>
          <article className="contact-card">
            <p className="eyebrow">Social Media</p>
            <h2>Continue the conversation</h2>
            <div className="contact-social-links">
              {socialLinks.map(({ label, href }) => href ? <a key={label} href={href}>{label}</a> : <span className="footer-placeholder" key={label}>{label} unavailable</span>)}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
