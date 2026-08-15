import "server-only";

import crypto from "node:crypto";
import { sql } from "@vercel/postgres";
import { sendNewsletterEmail } from "@/app/lib/email";

export type ContactSubmissionResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

let schemaPromise: Promise<void> | null = null;

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id text PRIMARY KEY,
          name text NOT NULL,
          email text NOT NULL,
          message text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
    })();
  }

  await schemaPromise;
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  message: string;
  website: string;
}): Promise<ContactSubmissionResult> {
  if (input.website.trim()) {
    return { status: "success", message: "Thank you. Your message has been received." };
  }

  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const message = input.message.trim();

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Please complete your name, email address, and message.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  if (name.length > 160 || email.length > 320 || message.length > 10_000) {
    return {
      status: "error",
      message: "Please shorten your message and try again.",
    };
  }

  const submissionId = crypto.randomUUID();

  try {
    await ensureSchema();

    await sql`
      INSERT INTO contact_submissions (id, name, email, message, created_at)
      VALUES (${submissionId}, ${name}, ${email}, ${message}, ${nowIso()})
    `;
  } catch (error) {
    console.error(
      "[contact] Submission could not be stored.",
      error instanceof Error ? error.message : "Unknown error",
    );

    return {
      status: "error",
      message: "Your message could not be sent right now. Please try again.",
    };
  }

  const contactToEmail = process.env.CONTACT_TO_EMAIL?.trim();

  if (!contactToEmail) {
    console.error("[contact] CONTACT_TO_EMAIL is not configured.");

    return {
      status: "error",
      message: "Your message was received, but email notification is not configured yet.",
    };
  }

  const emailDelivery = await sendNewsletterEmail({
    to: contactToEmail,
    subject: `New Contact Message from ${name}`,
    html: `
      <h2 style="margin:0 0 20px;">New Contact Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
      <p style="margin-top:24px;color:#6f655b;font-size:13px;">
        Reply directly to ${escapeHtml(email)} to respond to the sender.
      </p>
    `,
    text: [
      "New Contact Message",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
      "",
      `Reply directly to ${email} to respond to the sender.`,
    ].join("\n"),
  });

  if (!emailDelivery.ok) {
    console.error(
      "[contact] Submission was stored, but email notification failed:",
      emailDelivery.error,
    );

    return {
      status: "error",
      message:
        "Your message was received, but we could not deliver the email notification right now.",
    };
  }

  return {
    status: "success",
    message: "Thank you. Your message has been received.",
  };
}
