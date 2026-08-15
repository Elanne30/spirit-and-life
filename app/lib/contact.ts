import "server-only";

import crypto from "node:crypto";
import { sql } from "@vercel/postgres";

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
    return { status: "error", message: "Please complete your name, email address, and message." };
  }

  if (!isValidEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (name.length > 160 || email.length > 320 || message.length > 10_000) {
    return { status: "error", message: "Please shorten your message and try again." };
  }

  try {
    await ensureSchema();
    await sql`
      INSERT INTO contact_submissions (id, name, email, message, created_at)
      VALUES (${crypto.randomUUID()}, ${name}, ${email}, ${message}, ${nowIso()})
    `;
  } catch (error) {
    console.error("[contact] Submission could not be stored.", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: "Your message could not be sent right now. Please try again." };
  }

  return { status: "success", message: "Thank you. Your message has been received." };
}