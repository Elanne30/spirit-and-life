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
      <section className="page-intro page-container contact-hero">
        <p className="eyebrow">Get in Touch</p>
        <h1>Contact</h1>
        <p>Have a question, a reflection to share, or a thought to discuss? I&apos;d love to hear from you.</p>
      </section>

      <section className="contact-layout">
        <form className="contact-form" action={formAction}>
          <div className="contact-form-heading"><p className="eyebrow">Correspondence</p><h2>Send a message</h2><p>Share a question, reflection, or thought and I&apos;ll respond personally.</p></div>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Your name" required maxLength={160} />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="your@email.com" required maxLength={320} />
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Your message..." required maxLength={10_000} />
          <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
          <button className="button button-primary" type="submit" disabled={isPending}>{isPending ? "Sending..." : "Send Message"}</button>
          {state.status === "success" ? <p role="status">{state.message}</p> : null}
          {state.status === "error" ? <p className="form-error" role="alert">{state.message}</p> : null}
        </form>

        <div className="contact-stack">
          <article className="contact-card"><p className="eyebrow">A considered reply</p><h2>Response Time</h2><p>Thoughtful replies take time. I aim to respond within a few days, because careful questions deserve careful answers.</p></article>
          <article className="contact-card"><p className="eyebrow">Email</p><h2>Direct correspondence</h2><p>{siteConfig.contact.email ? <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> : "An email address will be published when the contact connection is configured."}</p></article>
          <article className="contact-card"><p className="eyebrow">Social Media</p><h2>Continue the conversation</h2><div className="contact-social-links">{socialLinks.map(({ label, href }) => href ? <a key={label} href={href}>{label}</a> : <span className="footer-placeholder" key={label}>{label} unavailable</span>)}</div></article>
          <article className="contact-card contact-note"><p className="eyebrow">Spirit &amp; Life</p><h2>Thoughtful questions are welcome.</h2><p>Whether your question is about Scripture, faith, theology, philosophy, or something you have been thinking through, you are welcome to write.</p></article>
        </div>
      </section>

      <style>{`
        .contact-main { position: relative; background: var(--background); padding-bottom: clamp(4rem, 8vw, 7rem); }
        .contact-main .contact-hero { position: relative; isolation: isolate; width: min(100% - 3rem, 76rem); max-width: none; min-height: 31rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; overflow: hidden; padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem); border-bottom: 1px solid var(--line); text-align: left; }
        .contact-main .contact-hero::before { position: absolute; z-index: -2; inset: 0; content: ""; background: linear-gradient(90deg, color-mix(in srgb, var(--background) 98%, transparent), color-mix(in srgb, var(--background) 88%, transparent) 42%, color-mix(in srgb, var(--background) 38%, transparent)), url("/images/journals/notes from morning prayer.jpg") center / cover no-repeat; opacity: .9; }
        .contact-main .contact-hero::after { position: absolute; z-index: -1; inset: 0; content: ""; background: radial-gradient(circle at 78% 46%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 35%); pointer-events: none; }
        .contact-main .contact-hero .eyebrow { margin-bottom: 1.1rem; }
        .contact-main .contact-hero h1 { margin: .2rem 0 1.2rem; font-size: clamp(3.7rem, 8vw, 6.8rem); line-height: .88; letter-spacing: -.055em; }
        .contact-main .contact-hero > p:last-child { max-width: 39rem; margin: 0; color: var(--muted); line-height: 1.7; }
        .contact-main .contact-layout { width: min(100% - 3rem, 76rem); margin-inline: auto; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(19rem, .92fr); gap: clamp(1.25rem, 3vw, 2rem); padding-top: clamp(2rem, 4vw, 3rem); }
        .contact-main .contact-form { padding: clamp(1.5rem, 3.5vw, 2.75rem); border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); box-shadow: 0 1.2rem 3rem var(--shadow); }
        .contact-main .contact-form-heading { margin-bottom: 1.8rem; }
        .contact-main .contact-form-heading h2 { margin: .35rem 0 .65rem; font-size: clamp(2rem, 4vw, 3.3rem); line-height: .98; }
        .contact-main .contact-form-heading > p:last-child { color: var(--muted); line-height: 1.65; }
        .contact-main .contact-form label { display: block; margin: 1rem 0 .45rem; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
        .contact-main .contact-form input:not([type="hidden"]), .contact-main .contact-form textarea { width: 100%; border: 1px solid var(--line); border-radius: .15rem; background: var(--background); color: var(--foreground); padding: .9rem .95rem; outline: none; transition: border-color 180ms ease, box-shadow 180ms ease; }
        .contact-main .contact-form textarea { min-height: 12rem; resize: vertical; line-height: 1.6; }
        .contact-main .contact-form input:focus, .contact-main .contact-form textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent); }
        .contact-main .contact-form .button { margin-top: 1.2rem; }
        .contact-main .contact-stack { display: grid; gap: 1rem; align-content: start; }
        .contact-main .contact-card { padding: 1.35rem 1.45rem; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); box-shadow: 0 .8rem 2rem var(--shadow); }
        .contact-main .contact-card h2 { margin: .4rem 0 .65rem; font-size: clamp(1.45rem, 2.5vw, 2rem); line-height: 1.02; }
        .contact-main .contact-card p:not(.eyebrow) { color: var(--muted); line-height: 1.7; }
        .contact-main .contact-card a { color: var(--accent); overflow-wrap: anywhere; }
        .contact-main .contact-social-links { display: flex; flex-wrap: wrap; gap: .55rem; margin-top: .9rem; }
        .contact-main .contact-social-links a, .contact-main .contact-social-links .footer-placeholder { padding: .5rem .7rem; border: 1px solid var(--line); border-radius: 999px; font-size: .78rem; text-decoration: none; }
        .contact-main .contact-note { background: linear-gradient(135deg, var(--surface), color-mix(in srgb, var(--surface) 78%, var(--accent))); }
        html[data-theme="light"] .contact-main .contact-hero::before { opacity: .58; }
        @media (max-width: 800px) { .contact-main .contact-hero, .contact-main .contact-layout { width: min(100% - 2rem, 40rem); } .contact-main .contact-hero { min-height: 25rem; padding-block: 4rem 3.5rem; } .contact-main .contact-hero::before { background: linear-gradient(180deg, color-mix(in srgb, var(--background) 96%, transparent), color-mix(in srgb, var(--background) 72%, transparent)), url("/images/journals/notes from morning prayer.jpg") center / cover no-repeat; opacity: .68; } .contact-main .contact-hero h1 { font-size: clamp(3.3rem, 15vw, 5.2rem); } .contact-main .contact-layout { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .contact-main .contact-form { padding: 1.2rem; } .contact-main .contact-form textarea { min-height: 10rem; } }
      `}</style>
    </main>
  );
}
