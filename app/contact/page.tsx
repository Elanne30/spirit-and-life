"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/app/components/button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="contact-main">
      <section className="page-intro page-container">
        <p className="eyebrow">Get in Touch</p>
        <h1>Contact</h1>
        <p>Have a question, a reflection to share, or a thought to discuss? I&apos;d love to hear from you.</p>
      </section>

      <section className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a message</h2>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Your name" required />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="your@email.com" required />
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Your message..." required />
          <Button type="submit">Send Message</Button>
          {sent ? <p role="status">Thank you. Your message is ready to be sent, and I&apos;ll respond as soon as I can.</p> : null}
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
        </div>
      </section>
    </main>
  );
}
